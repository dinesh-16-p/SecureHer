"""
Backend Endpoint Integration Tests for SecureHer
Tests FastAPI endpoints directly without sending real external emails:
- /api/health
- /api/sos (auth validation, recipient validation, Brevo response mapping)
- /api/journey/share (recipient validation)
"""

import sys
import unittest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException

# Add backend directory to sys.path
sys.path.insert(0, 'backend')
from main import app, health_check, send_sos_alert, share_journey_update, SOSRequest, JourneyShareRequest, ContactRecipient

class TestBackendEndpoints(unittest.TestCase):

    def test_health_check(self):
        """Verify /api/health returns structured status and timestamp"""
        res = health_check()
        self.assertEqual(res.get("status"), "healthy")
        self.assertEqual(res.get("service"), "SecureHer Women's Security Backend")
        self.assertIn("brevoConfigured", res)
        self.assertIn("timestamp", res)

    def test_sos_invalid_token_rejected_with_401(self):
        """Verify invalid or expired token raises 401 Unauthorized"""
        req = SOSRequest(
            latitude=12.9716,
            longitude=77.5946,
            accuracy=10.0,
            recipientEmail="emergency@example.com"
        )
        with patch("main.verify_firebase_token", return_value=None):
            with self.assertRaises(HTTPException) as ctx:
                send_sos_alert(req, authorization="Bearer invalid_token_12345")
            self.assertEqual(ctx.exception.status_code, 401)
            self.assertIn("Invalid or expired", ctx.exception.detail)

    def test_sos_invalid_recipient_rejected_with_400(self):
        """Verify malformed or empty recipient email raises 400 Bad Request"""
        req = SOSRequest(
            latitude=12.9716,
            longitude=77.5946,
            recipientEmail="not_an_email"
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            with self.assertRaises(HTTPException) as ctx:
                send_sos_alert(req, authorization="Bearer valid_token_12345")
            self.assertEqual(ctx.exception.status_code, 400)
            self.assertIn("No valid emergency contact email", ctx.exception.detail)

    def test_sos_brevo_acceptance_mapped_to_provider_accepted(self):
        """Verify HTTP 201 from Brevo is mapped to provider_accepted, NOT false inbox delivery"""
        req = SOSRequest(
            latitude=12.9716,
            longitude=77.5946,
            accuracy=8.5,
            recipients=[ContactRecipient(email="trusted@example.com", name="Trusted Guardian")]
        )
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.text = '{"messageId": "<test.msg.123@smtp-relay.brevo.com>"}'
        mock_response.json.return_value = {"messageId": "<test.msg.123@smtp-relay.brevo.com>"}

        with patch("main.BREVO_API_KEY", "mock_key_123"), \
             patch("main.BREVO_SENDER_EMAIL", "alerts@secureher.app"), \
             patch("main.verify_firebase_token", return_value={"uid": "user123", "displayName": "Alice"}), \
             patch("requests.post", return_value=mock_response):
            
            res = send_sos_alert(req, authorization="Bearer valid_token_12345")
            self.assertTrue(res.get("success"))
            self.assertEqual(res.get("emailStatus"), "provider_accepted")
            self.assertEqual(res.get("providerStatus"), "accepted")
            self.assertEqual(res.get("messageId"), "<test.msg.123@smtp-relay.brevo.com>")
            self.assertEqual(res.get("locationStatus"), "available")
            self.assertIn("trusted@example.com", res.get("recipients"))

    def test_sos_missing_brevo_credentials(self):
        """Verify missing Brevo credentials gracefully returns failure without server crash"""
        req = SOSRequest(
            recipientEmail="trusted@example.com"
        )
        with patch("main.BREVO_API_KEY", ""), \
             patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            res = send_sos_alert(req, authorization="Bearer valid_token")
            self.assertFalse(res.get("success"))
            self.assertEqual(res.get("emailStatus"), "failed")
            self.assertEqual(res.get("providerStatus"), "missing_credentials")

    def test_journey_share_invalid_recipient_rejected_with_400(self):
        """Verify journey share with empty recipient raises 400"""
        req = JourneyShareRequest(
            journeyTitle="Night commute",
            destinationLabel="Home",
            recipientEmail="invalid_email"
        )
        with patch("main.verify_firebase_token", return_value={"uid": "user123"}):
            with self.assertRaises(HTTPException) as ctx:
                share_journey_update(req, authorization="Bearer valid_token")
            self.assertEqual(ctx.exception.status_code, 400)

if __name__ == "__main__":
    unittest.main()
