/**
 * Safety API Client
 * Interfaces with the SecureHer FastAPI Backend for SOS alert verification & Brevo email delivery
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { available: true, data };
    }
    return { available: false, error: 'Non-200 response from backend' };
  } catch (err) {
    return { available: false, error: err.message };
  }
};

export const sendSOSAlert = async ({ token, latitude, longitude, accuracy, recipientEmail, recipientName, userName, userPhone }) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const headers = {
      'Content-Type': 'application/json'
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

    if (response.ok && result.success) {
      return {
        success: true,
        backendAvailable: true,
        emailSent: true,
        message: result.message || 'SOS alert email dispatched successfully.',
        data: result
      };
    } else {
      return {
        success: false,
        backendAvailable: true,
        emailSent: false,
        message: result.detail || result.message || 'Failed to dispatch SOS alert email.',
        data: result
      };
    }
  } catch (err) {
    return {
      success: false,
      backendAvailable: false,
      emailSent: false,
      message: 'SOS backend email service is currently unreachable. Please call your emergency contacts or helplines directly.',
      error: err.message
    };
  }
};
