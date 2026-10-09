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

export const sendSOSAlert = async ({ token, latitude, longitude, accuracy, recipientEmail, recipientName, userName, userPhone }) => {
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

    if (response.ok && result.success && result.emailStatus === 'sent') {
      return {
        success: true,
        backendAvailable: true,
        emailSent: true,
        emailStatus: 'sent',
        locationStatus: result.locationStatus || (latitude ? 'available' : 'unavailable'),
        messageId: result.messageId,
        message: result.message || `Emergency alert email sent to ${recipientEmail}`,
        data: result
      };
    } else {
      const errorDetail = result.detail || result.error || result.message || 'Email delivery could not be confirmed.';
      return {
        success: false,
        backendAvailable: true,
        emailSent: false,
        emailStatus: 'failed',
        locationStatus: latitude ? 'available' : 'unavailable',
        message: errorDetail,
        error: errorDetail,
        data: result
      };
    }
  } catch (err) {
    return {
      success: false,
      backendAvailable: false,
      emailSent: false,
      emailStatus: 'unreachable',
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
      return { success: true, message: result.message || 'Journey progress shared.' };
    }
    return {
      success: false,
      message: result.detail || result.message || 'Could not send journey email update.'
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Network error while contacting journey sharing service.'
    };
  }
};

