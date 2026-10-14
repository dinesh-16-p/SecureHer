import { Capacitor, registerPlugin } from '@capacitor/core';

// Register the native DirectSms Capacitor plugin (implemented in DirectSmsPlugin.java)
export const DirectSms = registerPlugin('DirectSms');

/**
 * Validate phone number format (E.164, national with or without spaces/dashes)
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Must be between 7 and 16 digits, optionally starting with '+'
  return /^\+?[0-9]{7,16}$/.test(cleaned);
};

/**
 * Clean phone number for dialing/SMS
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[\s\-\(\)\.]/g, '');
};

/**
 * Construct emergency SMS body.
 * Include Google Maps link ONLY when valid coordinates are present.
 */
export const buildEmergencySmsText = ({ userName, latitude, longitude, accuracy, isStale }) => {
  const name = userName ? userName.trim() : 'SecureHer User';
  let message = `EMERGENCY! ${name} needs help. Please contact immediately.`;

  if (latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined) {
    const lat = Number(latitude).toFixed(5);
    const lng = Number(longitude).toFixed(5);
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    
    let accuracyNote = '';
    if (accuracy) {
      accuracyNote = ` (±${Math.round(accuracy)}m)`;
    }
    if (isStale) {
      accuracyNote += ' [Stale Fix]';
    }

    message += ` Location${accuracyNote}: ${mapsLink}`;
  } else {
    message += ' (GPS coordinates unavailable at trigger)';
  }

  return message;
};

/**
 * Check if the current runtime platform supports direct native SMS sending.
 */
export const isNativeSmsSupported = () => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

/**
 * High-level SMS dispatch method that coordinates native direct SMS with Web/PWA fallback.
 * 
 * Outcomes:
 * - 'dispatched_to_carrier' (Native Android: SMS handed over to cellular carrier radio)
 * - 'permission_denied' (Native Android: SEND_SMS permission rejected by user)
 * - 'no_sim' (Native Android: Device lacks an active cellular SIM)
 * - 'unsupported_platform' (Web/PWA: Browsers cannot send background SMS directly)
 * - 'invalid_recipient' (Invalid or missing phone number)
 * - 'failed' (Send attempt failed)
 */
export const dispatchEmergencySms = async ({
  recipientPhone,
  userName,
  latitude,
  longitude,
  accuracy,
  isStale
}) => {
  // 1. Recipient validation
  if (!recipientPhone || !isValidPhoneNumber(recipientPhone)) {
    return {
      success: false,
      channel: 'sms',
      status: 'invalid_recipient',
      error: 'Invalid or missing emergency contact phone number.',
      message: 'Emergency contact does not have a valid mobile phone number.'
    };
  }

  const cleanPhone = cleanPhoneNumber(recipientPhone);
  const messageBody = buildEmergencySmsText({ userName, latitude, longitude, accuracy, isStale });

  // 2. Platform Check: Native Android vs Web/PWA
  if (!isNativeSmsSupported()) {
    // Transparent Web/PWA limitation
    return {
      success: false,
      channel: 'sms',
      platform: 'web',
      status: 'unsupported_platform',
      recipient: cleanPhone,
      messageBody,
      error: 'Direct background SMS is only available in the native Android app.',
      message: 'Direct SMS is not supported by web browsers. Please use the SMS app link or call 112 directly.',
      smsUri: `sms:${cleanPhone}?body=${encodeURIComponent(messageBody)}`
    };
  }

  // 3. Native Android Flow
  try {
    // Check permission status
    const status = await DirectSms.checkPermissions();
    if (status.sms !== 'granted') {
      const requestResult = await DirectSms.requestPermissions({ permissions: ['sms'] });
      if (requestResult.sms !== 'granted') {
        return {
          success: false,
          channel: 'sms',
          platform: 'android',
          status: 'permission_denied',
          recipient: cleanPhone,
          messageBody,
          error: 'SEND_SMS permission was denied by user.',
          message: 'SMS permission denied. Enable SMS permissions in Android Settings or open SMS composer.'
        };
      }
    }

    // Inspect SIM status
    const simCheck = await DirectSms.canSendSms();
    if (!simCheck.hasSim) {
      return {
        success: false,
        channel: 'sms',
        platform: 'android',
        status: 'no_sim',
        recipient: cleanPhone,
        messageBody,
        error: 'No active SIM card detected on this device.',
        message: 'No active SIM card detected. Cellular SMS cannot be sent without carrier service.'
      };
    }

    // Dispatch SMS via native SmsManager
    const result = await DirectSms.sendSms({
      phoneNumber: cleanPhone,
      message: messageBody
    });

    return {
      success: true,
      channel: 'sms',
      platform: 'android',
      status: 'dispatched_to_carrier',
      recipient: cleanPhone,
      messageBody,
      partsCount: result.partsCount || 1,
      message: `Direct emergency SMS handed over to cellular network for ${cleanPhone}. (Carrier SMS rates may apply)`
    };
  } catch (err) {
    const isNoSim = err.code === 'NO_SIM' || (err.message && err.message.toLowerCase().includes('sim'));
    return {
      success: false,
      channel: 'sms',
      platform: 'android',
      status: isNoSim ? 'no_sim' : 'failed',
      recipient: cleanPhone,
      messageBody,
      error: err.message || 'Failed to dispatch SMS',
      message: isNoSim
        ? 'No active SIM card found on device.'
        : `Native SMS failed: ${err.message || 'Unknown cellular radio error'}`
    };
  }
};

/**
 * Fallback to open the device's native SMS application composer with prepared message
 */
export const openSmsComposerFallback = async (recipientPhone, messageBody) => {
  const cleanPhone = cleanPhoneNumber(recipientPhone);
  if (isNativeSmsSupported()) {
    try {
      await DirectSms.openSmsApp({ phoneNumber: cleanPhone, message: messageBody });
      return true;
    } catch (e) {
      console.warn('Native openSmsApp failed, falling back to window.open:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const uri = `sms:${cleanPhone}?body=${encodeURIComponent(messageBody || '')}`;
    window.location.href = uri;
    return true;
  }
  return false;
};
