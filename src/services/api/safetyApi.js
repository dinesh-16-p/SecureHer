/**
 * Safety API Client
 * Interfaces with the SecureHer FastAPI Backend for SOS alert verification & Brevo email delivery
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { available: true, data };
    }
    return { available: false, error: `Backend responded with HTTP ${response.status}` };
  } catch (err) {
    return { available: false, error: err.message || 'Backend unreachable' };
  }
};

export const sendSOSAlert = async ({
  token,
  latitude,
  longitude,
  accuracy,
  recipientEmail,
  recipientName,
  recipients,
  userName,
  userPhone
}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      accuracy: accuracy ?? null,
      recipientEmail: recipientEmail || null,
      recipientName: recipientName || null,
      recipients: Array.isArray(recipients) && recipients.length > 0 ? recipients : undefined,
      userName: userName || 'SecureHer User',
      userPhone: userPhone || '',
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/sos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const result = await response.json().catch(() => ({}));

    // Provider accepted or sent status from Brevo dispatch
    if (response.ok && result.success && (result.emailStatus === 'provider_accepted' || result.emailStatus === 'sent')) {
      return {
        success: true,
        backendAvailable: true,
        emailSent: true, // indicates dispatched and accepted by provider
        emailStatus: result.emailStatus || 'provider_accepted',
        providerStatus: result.providerStatus || 'accepted',
        locationStatus: result.locationStatus || (latitude ? 'available' : 'unavailable'),
        messageId: result.messageId,
        recipients: result.recipients || (recipientEmail ? [recipientEmail] : []),
        message: result.message || `Emergency alert accepted by email provider for ${recipientEmail}`,
        data: result
      };
    } else {
      const errorDetail =
        result.detail ||
        result.error ||
        result.message ||
        (response.status === 401
          ? 'Authentication token invalid or expired'
          : response.status === 400
          ? 'Invalid SOS parameters or missing recipient'
          : 'Emergency alert dispatch could not be processed.');
      return {
        success: false,
        backendAvailable: true,
        emailSent: false,
        emailStatus: result.emailStatus || 'failed',
        providerStatus: result.providerStatus || 'rejected',
        locationStatus: latitude ? 'available' : 'unavailable',
        recipients: result.recipients || (recipientEmail ? [recipientEmail] : []),
        message: errorDetail,
        error: errorDetail,
        statusCode: response.status,
        data: result
      };
    }
  } catch (err) {
    return {
      success: false,
      backendAvailable: false,
      emailSent: false,
      emailStatus: 'unreachable',
      providerStatus: 'unreachable',
      locationStatus: latitude ? 'available' : 'unavailable',
      message: 'FastAPI backend service is currently unreachable. Please contact your emergency contact directly or call 112.',
      error: err.message
    };
  }
};

export const shareJourneyProgress = async ({
  token,
  journeyTitle,
  destinationLabel,
  status = 'active',
  latitude,
  longitude,
  expectedArrivalAt,
  recipientEmail,
  recipientName,
  userName,
  notes
}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      journeyTitle,
      destinationLabel: destinationLabel || '',
      status,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      expectedArrivalAt: expectedArrivalAt || null,
      recipientEmail,
      recipientName: recipientName || null,
      userName: userName || 'SecureHer User',
      notes: notes || null
    };

    const response = await fetch(`${API_BASE_URL}/api/journey/share`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const result = await response.json().catch(() => ({}));
    if (response.ok && result.success) {
      return {
        success: true,
        emailStatus: result.emailStatus || 'sent',
        recipient: recipientEmail,
        messageId: result.messageId,
        message: result.message || `Journey progress shared with ${recipientEmail}.`
      };
    }
    return {
      success: false,
      emailStatus: result.emailStatus || 'failed',
      recipient: recipientEmail,
      message: result.detail || result.message || 'Could not send journey email update.'
    };
  } catch (err) {
    return {
      success: false,
      emailStatus: 'unreachable',
      recipient: recipientEmail,
      message: err.message || 'Network error while contacting journey sharing service.'
    };
  }
};

