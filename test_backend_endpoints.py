"""
Backend Endpoint Integration Tests for SecureHer
Tests FastAPI endpoints directly:
- /api/health
- /api/sos/push (auth validation, token handling, recipient handling, FCM push dispatch)
- /api/journey/share (recipient validation, journey progress)
"""

import sys
import unittest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException

# Add backend directory to sys.path
sys.path.insert(0, 'backend')
from main import app, health_check, send_sos_push_alert, share_journey_update, send_sos_email_alert, SOSPushRequest, JourneyShareRequest, SOSEmailRequest

class TestBackendEndpoints(unittest.TestCase):

    def test_health_check(self):
        """Verify /api/health returns structured status and timestamp"""
        res = health_check()
        self.assertEqual(res.get("status"), "healthy")
        self.assertEqual(res.get("service"), "SecureHer Women's Security Backend")
        self.assertIn("fcmConfigured", res)
        self.assertIn("timestamp", res)

    def test_sos_push_invalid_token_rejected_with_401(self):
        """Verify invalid or expired token raises 401 Unauthorized"""
        req = SOSPushRequest(
            latitude=12.9716,
            longitude=77.5946,
            accuracy=10.0,
            recipientTokens=["device_token_abc_123456789"]
        )
        with patch("main.verify_firebase_token", return_value=None):
            with self.assertRaises(HTTPException) as ctx:
                send_sos_push_alert(req, authorization="Bearer invalid_token_12345")
            self.assertEqual(ctx.exception.status_code, 401)
            self.assertIn("Invalid or expired", ctx.exception.detail)

    def test_sos_push_no_registered_devices(self):
        """Verify when no devices are registered, returns clean no_registered_devices without crashing"""
        req = SOSPushRequest(
            latitude=12.9716,
            longitude=77.5946,
            recipientTokens=[],
            recipientUids=["contact_uid_1"]
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            res = send_sos_push_alert(req, authorization="Bearer valid_token_12345")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("pushStatus"), "no_registered_devices")
            self.assertEqual(res.get("sentCount"), 0)
            self.assertEqual(res.get("unregisteredCount"), 1)

    def test_sos_push_with_valid_device_tokens(self):
        """Verify successful dispatch with registered FCM tokens"""
        req = SOSPushRequest(
            latitude=19.0760,
            longitude=72.8777,
            accuracy=15.0,
            recipientTokens=["device_token_abc_1234567890", "device_token_xyz_9876543210"],
            userName="Ananya"
        )
        mock_batch = MagicMock()
        mock_batch.success_count = 2
        mock_batch.failure_count = 0
        mock_batch.responses = [MagicMock(success=True), MagicMock(success=True)]

        with patch("main.verify_firebase_token", return_value={"uid": "user123", "displayName": "Ananya"}), \
             patch("firebase_admin.messaging.send_each_for_multicast", return_value=mock_batch, create=True):
            res = send_sos_push_alert(req, authorization="Bearer valid_token_12345")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("pushStatus"), "dispatched")
            self.assertEqual(res.get("sentCount"), 2)
            self.assertEqual(res.get("locationStatus"), "available")

    def test_sos_push_excludes_sender_own_devices(self):
        """Security test: Verify that emergency SOS does not alert the sender's own devices"""
        sender_uid = "sender_victim_123"
        req = SOSPushRequest(
            latitude=12.9716,
            longitude=77.5946,
            recipientTokens=["sender_device_tok_1111", "trusted_contact_device_tok_2222"],
            recipientUids=[sender_uid, "trusted_contact_456"]
        )

        mock_fs = MagicMock()
        # Mock sender's devices collection returning sender_device_tok_1111
        sender_device_doc = MagicMock()
        sender_device_doc.to_dict.return_value = {"token": "sender_device_tok_1111"}
        sender_doc_mock = MagicMock()
        sender_doc_mock.collection("devices").stream.return_value = [sender_device_doc]

        # Mock trusted contact device resolution
        trusted_contact_doc = MagicMock()
        trusted_contact_doc.to_dict.return_value = {"token": "trusted_contact_device_tok_2222"}
        contact_doc_mock = MagicMock()
        contact_doc_mock.collection("devices").stream.return_value = [trusted_contact_doc]

        def get_doc(uid):
            if uid == sender_uid:
                return sender_doc_mock
            return contact_doc_mock

        mock_fs.collection("users").document.side_effect = get_doc

        mock_batch = MagicMock()
        mock_batch.success_count = 1
        mock_batch.failure_count = 0
        mock_batch.responses = [MagicMock(success=True)]

        with patch("main.verify_firebase_token", return_value={"uid": sender_uid, "displayName": "Sender"}), \
             patch("main.firestore_client", mock_fs), \
             patch("firebase_admin.messaging.send_each_for_multicast", return_value=mock_batch, create=True) as mock_send:
            res = send_sos_push_alert(req, authorization="Bearer valid_sender_token")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("sentCount"), 1)

            # Assert that send was called with ONLY the trusted contact token, NOT sender's own token
            call_args = mock_send.call_args[0][0]
            self.assertIn("trusted_contact_device_tok_2222", call_args.tokens)
            self.assertNotIn("sender_device_tok_1111", call_args.tokens)

    def test_sos_push_handles_invalid_expired_tokens(self):
        """Verify invalid/expired tokens are recorded and cleaned up gracefully"""
        req = SOSPushRequest(
            latitude=12.9716,
            longitude=77.5946,
            recipientTokens=["expired_device_token_99999999"],
            recipientUids=["contact_uid_888"]
        )
        mock_batch = MagicMock()
        mock_batch.success_count = 0
        mock_batch.failure_count = 1
        fail_resp = MagicMock(success=False)
        fail_resp.exception = MagicMock(code="registration-token-not-registered")
        mock_batch.responses = [fail_resp]

        mock_fs = MagicMock()
        mock_fs.collection("users").document("contact_uid_888").collection("devices").stream.return_value = []

        with patch("main.verify_firebase_token", return_value={"uid": "user123", "displayName": "Victim"}), \
             patch("main.firestore_client", mock_fs), \
             patch("firebase_admin.messaging.send_each_for_multicast", return_value=mock_batch, create=True):
            res = send_sos_push_alert(req, authorization="Bearer valid_token_12345")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("sentCount"), 0)
            self.assertEqual(res.get("failedCount"), 1)
            self.assertIn("expired_device_token_99999999", res.get("invalidTokens", []))

    def test_journey_share_invalid_recipient_rejected_with_400(self):
        """Verify journey share rejects invalid email"""
        req = JourneyShareRequest(
            journeyTitle="Night Commute",
            destinationLabel="Home",
            recipientEmail="not_an_email"
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            with self.assertRaises(HTTPException) as ctx:
                share_journey_update(req, authorization="Bearer valid_token_12345")
            self.assertEqual(ctx.exception.status_code, 400)

    def test_sos_email_invalid_recipient_rejected_with_400(self):
        """Verify SOS email rejects invalid recipient email"""
        req = SOSEmailRequest(
            latitude=12.9716,
            longitude=77.5946,
            recipientEmail="invalid_email"
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            with self.assertRaises(HTTPException) as ctx:
                send_sos_email_alert(req, authorization="Bearer valid_token")
            self.assertEqual(ctx.exception.status_code, 400)

    def test_sos_email_successful_dispatch(self):
        """Verify SOS email dispatch succeeds when Brevo returns 201"""
        req = SOSEmailRequest(
            latitude=19.0760,
            longitude=72.8777,
            accuracy=12.0,
            recipientEmail="guardian@example.com",
            userName="Ananya"
        )
        mock_resp = MagicMock()
        mock_resp.status_code = 201
        mock_resp.text = '{"messageId": "<test_msg_12345@smtp-relay.brevo.com>"}'
        mock_resp.json.return_value = {"messageId": "<test_msg_12345@smtp-relay.brevo.com>"}

        with patch("main.verify_firebase_token", return_value={"uid": "user123", "displayName": "Ananya"}), \
             patch("main.BREVO_API_KEY", "mock_brevo_key_12345678"), \
             patch("main.BREVO_SENDER_EMAIL", "alerts@secureher.test"), \
             patch("requests.post", return_value=mock_resp):
            res = send_sos_email_alert(req, authorization="Bearer valid_token")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("emailStatus"), "sent")
            self.assertEqual(res.get("locationStatus"), "available")
            self.assertIn("guardian@example.com", res.get("recipients", []))

    def test_sos_email_missing_credentials(self):
        """Verify SOS email reports missing_credentials when Brevo API key is missing"""
        req = SOSEmailRequest(
            latitude=19.0760,
            longitude=72.8777,
            recipientEmail="guardian@example.com"
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}), \
             patch("main.BREVO_API_KEY", ""):
            res = send_sos_email_alert(req, authorization="Bearer valid_token")
            self.assertFalse(res.get("success"))
            self.assertEqual(res.get("emailStatus"), "failed")
            self.assertEqual(res.get("providerStatus"), "missing_credentials")

if __name__ == "__main__":
    unittest.main()
