import { isSupported, getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';
import { registerUserDeviceToken } from './firestoreService';
import { Capacitor } from '@capacitor/core';

let messaging = null;

export const initMessaging = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isSupported();
    if (supported && !messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (err) {
    console.info('Firebase Cloud Messaging not supported in this environment:', err.message);
    return null;
  }
};

/**
 * Request notification permission and register FCM device token for authenticated user
 */
export const registerDeviceForPush = async (uid, vapidKey = null) => {
  if (!uid || typeof window === 'undefined') {
    return { success: false, reason: 'unauthenticated_or_ssr' };
  }

  // 1. Check Notification API availability
  if (!('Notification' in window)) {
    return {
      success: false,
      reason: 'unsupported_platform',
      message: 'Push notifications are not supported on this browser.'
    };
  }

  try {
    // 2. Request browser permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        reason: 'permission_denied',
        message: 'Notification permission was denied.'
      };
    }

    // 3. Obtain FCM registration token
    const msg = await initMessaging();
    if (!msg) {
      return {
        success: false,
        reason: 'fcm_unsupported',
        message: 'FCM messaging is not supported in this runtime environment.'
      };
    }

    const tokenOptions = vapidKey ? { vapidKey } : undefined;
    const token = await getToken(msg, tokenOptions);

    if (!token) {
      return {
        success: false,
        reason: 'no_token',
        message: 'Failed to generate registration token from FCM.'
      };
    }

    // 4. Save device token under users/{uid}/devices
    const platform = Capacitor.isNativePlatform() ? Capacitor.getPlatform() : 'web';
    await registerUserDeviceToken(uid, { token, platform });

    return {
      success: true,
      token,
      platform,
      message: 'Device successfully registered for emergency push notifications.'
    };
  } catch (err) {
    console.warn('Error during FCM registration:', err);
    return {
      success: false,
      reason: 'registration_error',
      message: err.message || 'Unknown error registering device for push notifications.'
    };
  }
};

/**
 * Listen for foreground push messages
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
