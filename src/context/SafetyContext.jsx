import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  logSafetyEvent,
  updateSafetyEvent
} from '../services/firebase/firestoreService';
import {
  requestLocationAccess,
  watchLocationAccess,
  clearLocationWatch,
  isLocationFresh,
  getAccuracyCategory,
  LOCATION_MAX_AGE_MS,
  ACCURACY_THRESHOLDS,
  checkAllPermissions
} from '../services/permissionService';
import { sosAlarm } from '../services/audio/sosAlarm';
import { sendSOSPushAlert, sendSOSEmailAlert, checkBackendHealth } from '../services/api/safetyApi';
import {
  dispatchEmergencySms,
  isNativeSmsSupported,
  openSmsComposerFallback,
  isValidPhoneNumber
} from '../services/sms/smsService';
import { registerDeviceForPush } from '../services/firebase/fcmService';

const SafetyContext = createContext();

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isWatchingLocation, setIsWatchingLocation] = useState(false);

  // Centralized Watcher Subscriber Management
  const watchIdRef = useRef(null);
  const locationSubscribersRef = useRef(new Set());
  const isSosInFlightRef = useRef(false);
  const currentLocationRef = useRef(null);

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  const [permissions, setPermissions] = useState({
    location: 'prompt',
    camera: 'prompt',
    microphone: 'prompt',
    notifications: 'prompt'
  });

  const [sosActive, setSosActive] = useState(false);
  const [sosEventId, setSosEventId] = useState(null);
  const [sosStatus, setSosStatus] = useState({
    alarmPlaying: false,
    alarmAutoplayBlocked: false,
    locationObtained: false,
    locationStatus: 'unavailable', // 'fresh' | 'recent' | 'stale' | 'unavailable'
    isLocationStale: false,
    accuracyCategory: 'unknown',
    eventCreated: false,
    smsDispatched: false,
    smsStatus: 'idle', // 'idle' | 'dispatched_to_carrier' | 'permission_denied' | 'no_sim' | 'unsupported_platform' | 'failed'
    smsRecipient: null,
    smsPlatform: null,
    smsFallbackUri: null,
    emailDispatched: false,
    emailStatus: 'idle', // 'idle' | 'sent' | 'provider_accepted' | 'failed' | 'no_email' | 'unreachable'
    emailRecipients: [],
    pushDispatched: false,
    pushStatus: 'idle', // 'idle' | 'dispatched' | 'no_registered_devices' | 'failed'
    pushSentCount: 0,
    backendAvailable: null,
    message: '',
    timestamp: null
  });

  // Subscribe to Emergency Contacts for the authenticated user
  useEffect(() => {
    if (!user) {
      setEmergencyContacts([]);
      setContactsLoading(false);
      return;
    }

    setContactsLoading(true);
    const unsubscribe = subscribeEmergencyContacts(
      user.uid,
      (contacts) => {
        setEmergencyContacts(contacts);
        setContactsLoading(false);
      },
      (err) => {
        console.warn('Contacts subscription error:', err);
        setContactsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Refresh permission states
  const refreshPermissions = useCallback(async () => {
    try {
      const perms = await checkAllPermissions();
      setPermissions(perms);
    } catch (err) {
      console.warn('Error checking permissions:', err);
    }
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  // Primary emergency contact (priority #1 configured isPrimary with valid phone, #2 any contact with valid phone, #3 isPrimary, #4 first contact)
  const primaryEmergencyContact = useMemo(() => {
    if (!emergencyContacts || emergencyContacts.length === 0) return null;
    const primaryWithPhone = emergencyContacts.find(
      (c) => c.isPrimary && c.phone && isValidPhoneNumber(c.phone.trim())
    );
    if (primaryWithPhone) return primaryWithPhone;

    const anyWithPhone = emergencyContacts.find(
      (c) => c.phone && isValidPhoneNumber(c.phone.trim())
    );
    if (anyWithPhone) return anyWithPhone;

    const primaryOnly = emergencyContacts.find((c) => c.isPrimary);
    if (primaryOnly) return primaryOnly;

    return emergencyContacts[0];
  }, [emergencyContacts]);

  // All configured contacts that have a valid phone number
  const validPhoneContacts = useMemo(() => {
    if (!emergencyContacts || emergencyContacts.length === 0) return [];
    return emergencyContacts
      .filter((c) => c.phone && isValidPhoneNumber(c.phone.trim()))
      .map((c) => ({
        id: c.id,
        phone: c.phone.trim(),
        name: c.name?.trim() || 'Emergency Contact',
        isPrimary: !!c.isPrimary
      }));
  }, [emergencyContacts]);

  // Manual trigger to request / refresh location
  const getCurrentPosition = useCallback(async (options = {}) => {
    setIsLocating(true);
    setLocationError(null);
    const { forceFresh = true, timeout = 12000, maxAgeMs = LOCATION_MAX_AGE_MS } = options;

    try {
      const loc = await requestLocationAccess({
        maximumAge: forceFresh ? 0 : 10000,
        timeout,
        maxAgeMs
      });
      setCurrentLocation(loc);
      setIsLocating(false);
      refreshPermissions();
      return loc;
    } catch (err) {
      const errMsg = err.message || 'Unable to retrieve location';
      setLocationError(errMsg);
      setIsLocating(false);
      refreshPermissions();

      // If we have an existing fix, mark it clearly as stale so the UI knows it is not current
      if (currentLocation) {
        const markedStale = {
          ...currentLocation,
          isStale: true,
          isFresh: false,
          staleReason: `Fresh fix failed (${errMsg}). Last fix is from ${new Date(currentLocation.timestamp).toLocaleTimeString()}`
        };
        setCurrentLocation(markedStale);
        return markedStale;
      }
      return null;
    }
  }, [currentLocation, refreshPermissions]);

  // Manual calibration: allows the user to pin/calibrate their exact position
  // (essential on desktop laptops or indoor spaces where browser Wi-Fi/IP location is inaccurate)
  const setManualLocation = useCallback((coords) => {
    if (!coords) {
      // Clear manual override and trigger a fresh GPS acquisition
      getCurrentPosition({ forceFresh: true });
      return;
    }
    const { latitude, longitude, accuracy = 5, address = null } = coords;
    const manualFix = {
      latitude,
      longitude,
      accuracy,
      accuracyCategory: 'high',
      heading: null,
      speed: null,
      altitude: null,
      timestamp: Date.now(),
      ageMs: 0,
      isFresh: true,
      isStale: false,
      source: 'manual_calibration',
      isCalibrated: true,
      address
    };
    setCurrentLocation(manualFix);
    currentLocationRef.current = manualFix;
    setLocationError(null);

    // Broadcast to all active subscribers
    locationSubscribersRef.current.forEach((cb) => {
      try {
        cb(manualFix);
      } catch (err) {
        console.warn('Location subscriber notification note:', err);
      }
    });
  }, [getCurrentPosition]);

  // Centralized live location watch with shared subscriber registry
  const startWatchingLocation = useCallback((subscriberCallback) => {
    if (subscriberCallback && typeof subscriberCallback === 'function') {
      locationSubscribersRef.current.add(subscriberCallback);
    }

    // Start native browser watch if not already active
    if (watchIdRef.current === null) {
      setIsWatchingLocation(true);
      const wid = watchLocationAccess(
        (pos) => {
          // If user manually calibrated their position, don't let coarse browser IP overwrite it
          if (currentLocationRef.current?.isCalibrated && (pos.accuracy == null || pos.accuracy > 25)) {
            return;
          }
          // If we already have a fresh (< 30s) high-accuracy fix, reject temporary low-accuracy spike (> 200m)
          if (
            currentLocationRef.current &&
            currentLocationRef.current.isFresh &&
            currentLocationRef.current.accuracy != null &&
            currentLocationRef.current.accuracy <= 25 &&
            pos.accuracy != null &&
            pos.accuracy > 200
          ) {
            return;
          }

          setCurrentLocation(pos);
          currentLocationRef.current = pos;
          setLocationError(null);
          // Broadcast to all active subscribers
          locationSubscribersRef.current.forEach((cb) => {
            try {
              cb(pos);
            } catch (err) {
              console.warn('Location subscriber notification note:', err);
            }
          });
        },
        (err) => {
          setLocationError(err.message || 'Location watch error');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
      watchIdRef.current = wid;
    }

    // Return cleanup function for the caller
    return () => {
      if (subscriberCallback) {
        locationSubscribersRef.current.delete(subscriberCallback);
      }
      // If no components are listening, terminate browser watch to save battery
      if (locationSubscribersRef.current.size === 0 && watchIdRef.current !== null) {
        clearLocationWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsWatchingLocation(false);
      }
    };
  }, []);

  // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        clearLocationWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      locationSubscribersRef.current.clear();
    };
  }, []);

  // Emergency SOS Activation
  const triggerSOS = useCallback(async () => {
    if (isSosInFlightRef.current) {
      console.warn('SOS activation already in progress. Ignoring duplicate trigger.');
      return;
    }
    isSosInFlightRef.current = true;
    setSosActive(true);

    try {
      // 1. Play Emergency Siren Sound immediately upon user trigger
      const audioResult = await sosAlarm.play();
      const isAlarmPlaying = audioResult?.success ?? false;
      const isAutoplayBlocked = audioResult?.reason === 'autoplay_blocked';

      setSosStatus({
        alarmPlaying: isAlarmPlaying,
        alarmAutoplayBlocked: isAutoplayBlocked,
        locationObtained: false,
        locationStatus: 'unavailable',
        isLocationStale: false,
        accuracyCategory: 'unknown',
        eventCreated: false,
        smsDispatched: false,
        smsStatus: 'dispatching',
        pushDispatched: false,
        pushStatus: 'dispatching',
        recipients: validPhoneContacts.map((c) => c.phone),
        backendAvailable: null,
        message: 'SOS Initiated. Dispatching emergency alert...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // 2. Fast non-blocking GPS:
      // If current fix is fresh (< 30s), use it immediately without waiting!
      let targetLoc = null;
      let locationStatus = 'unavailable';

      if (currentLocation && isLocationFresh(currentLocation, 30000)) {
        targetLoc = { ...currentLocation, isFresh: true, isStale: false };
        locationStatus = 'fresh';
      } else {
        // Quick fresh GPS attempt (timeout: 3500ms max so emergency is never delayed)
        try {
          targetLoc = await requestLocationAccess({ maximumAge: 0, timeout: 3500 });
          targetLoc.isFresh = true;
          targetLoc.isStale = false;
          locationStatus = 'fresh';
          setCurrentLocation(targetLoc);
        } catch (locErr) {
          console.warn('SOS fresh location request note:', locErr.message);

          if (currentLocation && isLocationFresh(currentLocation, LOCATION_MAX_AGE_MS)) {
            // Fix was acquired within the past 120s
            const ageSec = Math.max(0, Math.round((Date.now() - currentLocation.timestamp) / 1000));
            targetLoc = {
              ...currentLocation,
              isFresh: false,
              isStale: false,
              isRecent: true,
              ageSec
            };
            locationStatus = 'recent';
          } else if (currentLocation) {
            // Fix is older than 120s — mark clearly as stale
            const ageSec = Math.max(0, Math.round((Date.now() - currentLocation.timestamp) / 1000));
            targetLoc = {
              ...currentLocation,
              isFresh: false,
              isStale: true,
              staleReason: `GPS fix is stale by ${ageSec}s`,
              ageSec
            };
            locationStatus = 'stale';
            setCurrentLocation(targetLoc);
          } else {
            targetLoc = null;
            locationStatus = 'unavailable';
          }
        }
      }

      // 3. Log Safety Event in Firestore under users/{uid}/safetyEvents
      let createdEventId = null;
      const primaryPhone = primaryEmergencyContact?.phone || null;
      const primaryName = primaryEmergencyContact?.name || null;
      const recipientPhones = validPhoneContacts.map((c) => c.phone);
      const recipientUids = validPhoneContacts.map((c) => c.id);

      // Email recipients resolution: emergency contacts -> user profile emergency email -> account email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let validEmailContacts = (emergencyContacts || [])
        .filter((c) => c.email && emailRegex.test(c.email.trim()))
        .map((c) => ({
          email: c.email.trim(),
          name: c.name?.trim() || 'Emergency Contact'
        }));

      if (userProfile?.emergencyContactEmail && emailRegex.test(userProfile.emergencyContactEmail.trim())) {
        const profEmail = userProfile.emergencyContactEmail.trim();
        if (!validEmailContacts.some((c) => c.email.toLowerCase() === profEmail.toLowerCase())) {
          validEmailContacts.push({ email: profEmail, name: 'Primary SOS Alert Contact' });
        }
      }

      if (validEmailContacts.length === 0 && (user?.email || userProfile?.email)) {
        const fallbackEmail = (user?.email || userProfile?.email).trim();
        if (emailRegex.test(fallbackEmail)) {
          validEmailContacts.push({ email: fallbackEmail, name: userName });
        }
      }
      const recipientEmails = validEmailContacts.map((c) => c.email);

      if (user) {
        try {
          createdEventId = await logSafetyEvent(user.uid, {
            type: 'SOS',
            status: 'activated',
            latitude: targetLoc?.latitude ?? null,
            longitude: targetLoc?.longitude ?? null,
            accuracy: targetLoc?.accuracy ?? null,
            accuracyCategory: targetLoc?.accuracyCategory ?? 'unknown',
            locationStatus,
            locationTimestamp: targetLoc?.timestamp ?? null,
            isLocationStale: targetLoc?.isStale ?? false,
            recipientPhone: primaryPhone,
            recipientEmail: recipientEmails.length > 0 ? recipientEmails[0] : null,
            recipients: recipientPhones,
            recipientEmails,
            smsStatus: 'dispatching',
            emailStatus: validEmailContacts.length > 0 ? 'dispatching' : 'no_email',
            pushStatus: 'dispatching'
          });
          setSosEventId(createdEventId);
        } catch (eventErr) {
          console.warn('Failed to log safety event to Firestore:', eventErr);
        }
      }

      const userName = userProfile?.fullName || user?.displayName || 'SecureHer User';

      // 4. Channel 1: Native Android Direct SMS Dispatch (with Web/PWA transparent fallback)
      let smsResult = {
        success: false,
        status: 'no_contact',
        message: 'No emergency contact phone number configured.'
      };

      if (primaryPhone) {
        try {
          smsResult = await dispatchEmergencySms({
            recipientPhone: primaryPhone,
            userName,
            latitude: targetLoc?.latitude ?? null,
            longitude: targetLoc?.longitude ?? null,
            accuracy: targetLoc?.accuracy ?? null,
            isStale: targetLoc?.isStale ?? false
          });
        } catch (smsErr) {
          console.error('SMS dispatch error:', smsErr);
          smsResult = {
            success: false,
            status: 'failed',
            error: smsErr.message,
            message: `SMS dispatch failed: ${smsErr.message}`
          };
        }
      }

      // 5. Channel 2: Emergency Alert Email Dispatch via Brevo API
      let emailResult = {
        success: false,
        emailStatus: 'no_email',
        message: 'No emergency contact email configured.'
      };

      // 6. Channel 3: Firebase Cloud Messaging (FCM) Push Notification Dispatch
      let pushResult = {
        success: false,
        pushStatus: 'skipped',
        sentCount: 0,
        message: 'Push alert skipped.'
      };

      let idToken = null;
      if (user && typeof user.getIdToken === 'function') {
        try {
          idToken = await user.getIdToken();
        } catch (tokErr) {
          console.warn('Could not retrieve Firebase ID token:', tokErr);
        }
      }

      // Dispatch Email & Push in parallel
      const emailPromise = validEmailContacts.length > 0
        ? sendSOSEmailAlert({
            token: idToken,
            latitude: targetLoc?.latitude ?? null,
            longitude: targetLoc?.longitude ?? null,
            accuracy: targetLoc?.accuracy ?? null,
            recipients: validEmailContacts,
            recipientEmail: validEmailContacts[0].email,
            recipientName: validEmailContacts[0].name,
            userName,
            userPhone: userProfile?.phone || '',
            eventId: createdEventId
          }).catch((emailErr) => {
            console.warn('Email dispatch exception:', emailErr);
            return {
              success: false,
              emailStatus: 'failed',
              message: emailErr.message
            };
          })
        : Promise.resolve({
            success: false,
            emailStatus: 'no_email',
            message: 'No emergency contact email configured.'
          });

      const pushPromise = sendSOSPushAlert({
        token: idToken,
        latitude: targetLoc?.latitude ?? null,
        longitude: targetLoc?.longitude ?? null,
        accuracy: targetLoc?.accuracy ?? null,
        recipientUids,
        userName,
        userPhone: userProfile?.phone || '',
        eventId: createdEventId
      }).catch((pushErr) => {
        console.warn('Push alert exception:', pushErr);
        return {
          success: false,
          pushStatus: 'failed',
          message: pushErr.message
        };
      });

      [emailResult, pushResult] = await Promise.all([emailPromise, pushPromise]);

      // 7. Update Firestore event with SMS, Email, and Push outcomes
      if (user && createdEventId) {
        try {
          await updateSafetyEvent(user.uid, createdEventId, {
            smsStatus: smsResult.status || 'failed',
            smsRecipient: primaryPhone,
            smsPlatform: smsResult.platform || (isNativeSmsSupported() ? 'android' : 'web'),
            emailStatus: emailResult.emailStatus || 'failed',
            emailRecipients: recipientEmails,
            pushStatus: pushResult.pushStatus || 'failed',
            pushSentCount: pushResult.sentCount || 0,
            backendMessage: emailResult.message || pushResult.message || null
          });
        } catch (updErr) {
          console.warn('Failed to update safety event in Firestore:', updErr);
        }
      }

      // 8. Build transparent human-readable status message
      let statusSummary = '';
      if (smsResult.status === 'dispatched_to_carrier') {
        statusSummary = `Direct cellular SMS sent to ${primaryPhone}`;
      } else if (smsResult.status === 'unsupported_platform') {
        statusSummary = 'Web browser cannot send background SMS directly. Use SMS app link or call 112';
      } else if (smsResult.status === 'permission_denied') {
        statusSummary = 'SMS permission denied by user. Enable in Android Settings';
      } else if (smsResult.status === 'no_sim') {
        statusSummary = 'No active SIM card detected for direct cellular SMS';
      } else {
        statusSummary = smsResult.message || 'Emergency trigger processed';
      }

      if (emailResult.success) {
        statusSummary += ` • Emergency email dispatched to ${recipientEmails.join(', ')}`;
      } else if (emailResult.emailStatus === 'missing_credentials') {
        statusSummary += ' • Email gateway pending setup';
      } else if (emailResult.emailStatus !== 'no_email') {
        statusSummary += ` • Email ${emailResult.emailStatus}`;
      }

      if (pushResult.success && pushResult.sentCount > 0) {
        statusSummary += ` • Push alert sent to ${pushResult.sentCount} device(s)`;
      }

      if (targetLoc) {
        if (targetLoc.isStale) {
          statusSummary += ` • Stale GPS (${targetLoc.ageSec || Math.round(targetLoc.ageMs / 1000)}s)`;
        } else {
          statusSummary += ` • GPS ±${Math.round(targetLoc.accuracy)}m`;
        }
      } else {
        statusSummary += ' • Coordinates unavailable';
      }

      // 9. Update UI Status State
      setSosStatus({
        alarmPlaying: isAlarmPlaying,
        alarmAutoplayBlocked: isAutoplayBlocked,
        locationObtained: !!targetLoc,
        locationStatus,
        isLocationStale: targetLoc?.isStale ?? false,
        accuracyCategory: targetLoc?.accuracyCategory ?? 'unknown',
        eventCreated: !!createdEventId,
        smsDispatched: smsResult.status === 'dispatched_to_carrier',
        smsStatus: smsResult.status,
        smsRecipient: primaryPhone,
        smsPlatform: smsResult.platform || (isNativeSmsSupported() ? 'android' : 'web'),
        smsFallbackUri: smsResult.smsUri || null,
        emailDispatched: emailResult.success,
        emailStatus: emailResult.emailStatus,
        emailRecipients: recipientEmails,
        pushDispatched: pushResult.success && pushResult.sentCount > 0,
        pushStatus: pushResult.pushStatus,
        pushSentCount: pushResult.sentCount || 0,
        backendAvailable: pushResult.backendAvailable ?? emailResult.backendAvailable,
        message: statusSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      return {
        sms: smsResult,
        email: emailResult,
        push: pushResult,
        location: targetLoc
      };
    } finally {
      isSosInFlightRef.current = false;
    }
  }, [currentLocation, user, userProfile, primaryEmergencyContact, validPhoneContacts, emergencyContacts]);

  // Cancel SOS
  const cancelSOS = useCallback(async () => {
    sosAlarm.stop();
    setSosActive(false);

    if (user && sosEventId) {
      try {
        await updateSafetyEvent(user.uid, sosEventId, {
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Error updating cancelled SOS event:', err);
      }
    }

    setSosStatus((prev) => ({
      ...prev,
      alarmPlaying: false,
      alarmAutoplayBlocked: false,
      smsDispatched: false,
      smsStatus: 'idle',
      emailDispatched: false,
      emailStatus: 'idle',
      pushDispatched: false,
      pushStatus: 'idle',
      message: 'SOS Deactivated'
    }));
  }, [user, sosEventId]);

  // Resume or unmute alarm manually on user gesture
  const resumeAlarm = useCallback(async () => {
    const res = await sosAlarm.resume();
    setSosStatus((prev) => ({
      ...prev,
      alarmPlaying: res.success,
      alarmAutoplayBlocked: res.reason === 'autoplay_blocked'
    }));
    return res;
  }, []);

  // CRUD for Contacts
  const addContact = async (contactData) => {
    if (!user) throw new Error('User not authenticated');
    return await addEmergencyContact(user.uid, {
      ...contactData,
      priority: emergencyContacts.length + 1
    });
  };

  const removeContact = async (contactId) => {
    if (!user) throw new Error('User not authenticated');
    return await deleteEmergencyContact(user.uid, contactId);
  };

  const editContact = async (contactId, data) => {
    if (!user) throw new Error('User not authenticated');
    return await updateEmergencyContact(user.uid, contactId, data);
  };

  const value = {
    emergencyContacts,
    primaryEmergencyContact,
    validPhoneContacts,
    contactsLoading,
    currentLocation,
    locationError,
    isLocating,
    isWatchingLocation,
    getCurrentPosition,
    startWatchingLocation,
    setManualLocation,
    isLocationFresh,
    getAccuracyCategory,
    LOCATION_MAX_AGE_MS,
    ACCURACY_THRESHOLDS,
    permissions,
    refreshPermissions,
    sosActive,
    sosStatus,
    triggerSOS,
    cancelSOS,
    resumeAlarm,
    addContact,
    removeContact,
    editContact
  };

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
};

export default SafetyContext;

