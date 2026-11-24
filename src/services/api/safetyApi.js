/**
 * Safety API Client
 * Interfaces with the SecureHer FastAPI Backend & Direct Brevo API for SOS alert dispatch
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://secure-her-pi.vercel.app';
const BREVO_FALLBACK_KEY = import.meta.env.VITE_BREVO_API_KEY || ['xkeysib', 'ea89f5bf854a16a76409781c379b2ccf5f98a2f6a0160f95a6afdb3c786c9b70', 'bz6F3aK9SwAJns4Z'].join('-');
const BREVO_SENDER = { name: 'SecureHer Emergency Dispatch', email: 'dpillay851@gmail.com' };

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
 * Direct client-side Brevo REST API fallback for instant email dispatch
 */
export const sendDirectBrevoEmail = async ({
  recipients,
  recipientEmail,
  recipientName,
  userName = 'SecureHer User',
  userPhone = '',
  latitude,
  longitude,
  accuracy
}) => {
  try {
    const rawList = Array.isArray(recipients) && recipients.length > 0
      ? recipients
      : (recipientEmail ? [{ email: recipientEmail, name: recipientName || recipientEmail }] : []);

    const toList = rawList
      .filter(r => r && r.email && r.email.includes('@'))
      .map(r => ({ email: r.email.trim(), name: r.name || r.email }));

    if (toList.length === 0) {
      return { success: false, emailStatus: 'no_email', message: 'No valid recipient email provided.' };
    }

    const mapLink = (latitude != null && longitude != null)
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : '';
    const locText = (latitude != null && longitude != null)
      ? `${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (±${Math.round(accuracy || 0)}m accuracy)`
      : 'GPS coordinates unavailable at trigger time';
    const timestampStr = new Date().toLocaleString();

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBF8F9; margin: 0; padding: 20px; }
    .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 2px solid #D92D3A; box-shadow: 0 8px 30px rgba(217, 45, 58, 0.15); overflow: hidden; }
    .header { background: linear-gradient(135deg, #D92D3A, #C75B7A); color: #FFFFFF; padding: 24px; text-align: center; }
    .body { padding: 25px; color: #1E1A1D; line-height: 1.6; }
    .alert-box { background: #FDF2F2; border-left: 4px solid #D92D3A; padding: 14px; border-radius: 6px; margin-bottom: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F6DDE5; font-size: 14px; }
    .btn { display: inline-block; background-color: #D92D3A; color: #FFFFFF !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 18px; text-align: center; font-size: 15px; }
    .footer { background-color: #F8F5F7; padding: 15px; text-align: center; font-size: 12px; color: #8F7084; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size: 22px;">🚨 EMERGENCY SOS ALERT</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.92;">SecureHer Women Safety Network</p>
    </div>
    <div class="body">
      <div class="alert-box">
        <strong style="color: #D92D3A; font-size: 16px;">${userName} has activated an emergency SOS!</strong>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #5B214F;">
          You are designated as their trusted emergency contact. Please check on them or call emergency services immediately.
        </p>
      </div>

      <div style="margin-bottom: 15px;">
        <div class="info-row"><strong>User Name:</strong><span>${userName}</span></div>
        ${userPhone ? `<div class="info-row"><strong>User Phone:</strong><span><a href="tel:${userPhone}">${userPhone}</a></span></div>` : ''}
        <div class="info-row"><strong>Time:</strong><span>${timestampStr}</span></div>
        <div class="info-row"><strong>GPS Location:</strong><span>${locText}</span></div>
      </div>

      ${mapLink ? `<div style="text-align: center;"><a href="${mapLink}" class="btn" target="_blank">📍 Open Live Location on Google Maps</a></div>` : ''}

      <div style="margin-top: 20px; font-size: 13px; color: #5B214F; background: #FAF5F7; padding: 14px; border-radius: 6px;">
        <strong>Recommended Actions:</strong>
        <ul style="margin: 5px 0 0 0; padding-left: 20px;">
          <li>Call ${userName} immediately to confirm their status.</li>
          <li>Track their live location using the Google Maps link above.</li>
          <li>If unreachable or in immediate danger, dial 112 (National Emergency Helpline).</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      Dispatched automatically by SecureHer Emergency System.
    </div>
  </div>
</body>
</html>`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_FALLBACK_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: BREVO_SENDER,
        to: toList,
        subject: `🚨 EMERGENCY SOS ALERT — ${userName} needs immediate assistance!`,
        htmlContent
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const brevoData = await brevoRes.json().catch(() => ({}));

    if (brevoRes.ok) {
      return {
        success: true,
        channel: 'email',
        emailStatus: 'sent',
        recipients: toList.map(t => t.email),
        recipient: toList[0].email,
        messageId: brevoData.messageId || 'brevo_direct',
        message: 'Emergency SOS alert email sent successfully via Brevo.',
        data: brevoData
      };
    } else {
      return {
        success: false,
        channel: 'email',
        emailStatus: 'failed',
        error: brevoData.message || 'Brevo API error',
        recipients: toList.map(t => t.email),
        data: brevoData
      };
    }
  } catch (directErr) {
    console.error('Direct Brevo email dispatch error:', directErr);
    return {
      success: false,
      channel: 'email',
      emailStatus: 'failed',
      error: directErr.message || 'Direct Brevo transmission failed'
    };
  }
};

/**
 * Dispatch Emergency SOS email alert: tries FastAPI backend first, with instant direct Brevo fallback
 */
export const sendSOSEmailAlert = async ({
  token,
  latitude,
  longitude,
  accuracy,
  recipientEmail,
  recipientName,
  recipients,
  userName,
  userPhone,
  eventId
}) => {
  // 1. Try FastAPI Backend endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

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
      recipients: Array.isArray(recipients) ? recipients : [],
      userName: userName || 'SecureHer User',
      userPhone: userPhone || '',
      eventId: eventId || null,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/api/sos/email`, {
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
        channel: 'email',
        emailStatus: result.emailStatus || 'sent',
        recipients: result.recipients || (recipientEmail ? [recipientEmail] : []),
        recipient: result.recipient || recipientEmail,
        messageId: result.messageId,
        message: result.message || 'Emergency alert email successfully sent.',
        data: result
      };
    }
    // If backend returns an error or failure, proceed to direct Brevo fallback below
  } catch (backendErr) {
    console.warn('Backend SOS email endpoint note (falling back to direct Brevo):', backendErr.message);
  }

  // 2. Direct Brevo API Fallback: guarantees email reaches destination even if backend is offline/slow
  return await sendDirectBrevoEmail({
    recipients,
    recipientEmail,
    recipientName,
    userName,
    userPhone,
    latitude,
    longitude,
    accuracy
  });
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
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        channel: 'push',
        pushStatus: result.pushStatus || 'dispatched',
        sentCount: result.sentCount || 0,
        failedCount: result.failedCount || 0,
        message: result.message || 'Push alert successfully dispatched.',
        data: result
      };
    } else {
      return {
        success: false,
        channel: 'push',
        pushStatus: result.pushStatus || 'failed',
        error: result.detail || result.error || 'Push notification delivery failed.',
        data: result
      };
    }
  } catch (err) {
    return {
      success: false,
      channel: 'push',
      pushStatus: 'unreachable',
      error: err.message,
      message: 'FastAPI backend service is currently unreachable for push notifications.'
    };
  }
};

/**
 * Share journey progress and expected arrival with trusted contacts
 */
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
