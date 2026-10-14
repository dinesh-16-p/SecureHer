/**
 * Safety API Client
 * Interfaces with the SecureHer FastAPI Backend for SOS push notification dispatch and journey progress
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

/**
 * Dispatch Firebase Cloud Messaging (FCM) push notifications to trusted emergency contacts
 */
export const sendSOSPushAlert = async ({
  token,
  latitude,
  longitude,
  accuracy,
  recipientUids,
  recipientTokens,
  userName,
  userPhone,
  eventId
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
      recipientUids: Array.isArray(recipientUids) ? recipientUids : [],
      recipientTokens: Array.isArray(recipientTokens) ? recipientTokens : [],
      userName: userName || 'SecureHer User',
      userPhone: userPhone || '',
      eventId: eventId || null,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/sos/push`, {
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
        channel: 'fcm',
        backendAvailable: true,
        pushStatus: result.pushStatus || 'dispatched',
        sentCount: result.sentCount || 0,
        failedCount: result.failedCount || 0,
        unregisteredCount: result.unregisteredCount || 0,
        locationStatus: result.locationStatus || (latitude ? 'available' : 'unavailable'),
        message: result.message || `Push notification dispatched to ${result.sentCount || 0} trusted device(s).`,
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
          ? 'Invalid SOS parameters or missing recipient device tokens'
          : 'Emergency push notification dispatch could not be processed.');
      return {
        success: false,
        channel: 'fcm',
        backendAvailable: true,
        pushStatus: result.pushStatus || 'failed',
        sentCount: 0,
        failedCount: result.failedCount || 0,
        unregisteredCount: result.unregisteredCount || 0,
        locationStatus: latitude ? 'available' : 'unavailable',
        message: errorDetail,
        error: errorDetail,
        statusCode: response.status,
        data: result
      };
    }
  } catch (err) {
    return {
      success: false,
      channel: 'fcm',
      backendAvailable: false,
      pushStatus: 'unreachable',
      sentCount: 0,
      locationStatus: latitude ? 'available' : 'unavailable',
      message: 'FastAPI backend service is currently unreachable for push notifications. Direct SMS or helpline is recommended.',
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
      message: result.detail || result.message || 'Could not send journey update.'
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
