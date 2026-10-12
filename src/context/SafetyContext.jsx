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
import { sendSOSAlert, checkBackendHealth } from '../services/api/safetyApi';

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
    emailSent: false,
    emailStatus: 'idle', // 'idle' | 'sending' | 'provider_accepted' | 'failed' | 'unreachable'
    providerStatus: null,
    messageId: null,
    recipients: [],
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

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Primary emergency contact (priority #1 configured isPrimary with valid email, #2 any contact with valid email, #3 isPrimary phone only, #4 first contact)
  const primaryEmergencyContact = useMemo(() => {
    if (!emergencyContacts || emergencyContacts.length === 0) return null;
    const primaryWithEmail = emergencyContacts.find(
      (c) => c.isPrimary && c.email && EMAIL_REGEX.test(c.email.trim())
    );
    if (primaryWithEmail) return primaryWithEmail;

    const anyWithEmail = emergencyContacts.find(
      (c) => c.email && EMAIL_REGEX.test(c.email.trim())
    );
    if (anyWithEmail) return anyWithEmail;

    const primaryOnly = emergencyContacts.find((c) => c.isPrimary);
    if (primaryOnly) return primaryOnly;

    return emergencyContacts[0];
  }, [emergencyContacts]);

  // All configured contacts that have a valid email address
  const validEmailContacts = useMemo(() => {
    if (!emergencyContacts || emergencyContacts.length === 0) return [];
    return emergencyContacts
      .filter((c) => c.email && EMAIL_REGEX.test(c.email.trim()))
      .map((c) => ({
        email: c.email.trim(),
        name: c.name?.trim() || 'Emergency Contact'
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
          setCurrentLocation(pos);
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
        emailSent: false,
        emailStatus: 'sending',
        providerStatus: null,
        messageId: null,
        recipients: validEmailContacts.map((c) => c.email),
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
      const recipient = primaryEmergencyContact?.email || null;
      const recipientName = primaryEmergencyContact?.name || null;
      const allRecipientEmails = validEmailContacts.map((c) => c.email);

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
            recipientEmail: recipient,
            recipients: allRecipientEmails,
            emailStatus: 'sending'
          });
          setSosEventId(createdEventId);
        } catch (eventErr) {
          console.warn('Failed to log safety event to Firestore:', eventErr);
        }
      }

      // 4. Send request to FastAPI backend (Brevo email dispatch)
      let idToken = null;
      if (user && typeof user.getIdToken === 'function') {
        try {
          idToken = await user.getIdToken();
        } catch (tokErr) {
          console.warn('Could not retrieve Firebase ID token:', tokErr);
        }
      }

      const apiResult = await sendSOSAlert({
        token: idToken,
        latitude: targetLoc?.latitude ?? null,
        longitude: targetLoc?.longitude ?? null,
        accuracy: targetLoc?.accuracy ?? null,
        recipientEmail: recipient,
        recipientName: recipientName,
        recipients: validEmailContacts,
        userName: userProfile?.fullName || user?.displayName || 'SecureHer User',
        userPhone: userProfile?.phone || ''
      });

      // 5. Update Firestore event with backend dispatch result
      if (user && createdEventId) {
        try {
          await updateSafetyEvent(user.uid, createdEventId, {
            emailStatus: apiResult.emailStatus, // 'provider_accepted' | 'failed' | 'unreachable'
            providerStatus: apiResult.providerStatus,
            messageId: apiResult.messageId || null,
            backendMessage: apiResult.message
          });
        } catch (updErr) {
          console.warn('Failed to update safety event in Firestore:', updErr);
        }
      }

      // 6. Build transparent human-readable status message
      let statusSummary = apiResult.message;
      if (targetLoc) {
        if (targetLoc.isStale) {
          statusSummary += ` (Dispatched with last-known coordinates, stale by ${targetLoc.ageSec || Math.round(targetLoc.ageMs / 1000)}s)`;
        } else if (targetLoc.isRecent) {
          statusSummary += ` (Dispatched with recent GPS from ${targetLoc.ageSec}s ago, ±${Math.round(targetLoc.accuracy)}m)`;
        } else {
          statusSummary += ` (Live GPS accurate to ±${Math.round(targetLoc.accuracy)}m)`;
        }
      } else {
        statusSummary += ' (Alert sent without coordinates: GPS unavailable)';
      }

      // 7. Update UI Status State
      setSosStatus({
        alarmPlaying: isAlarmPlaying,
        alarmAutoplayBlocked: isAutoplayBlocked,
        locationObtained: !!targetLoc,
        locationStatus,
        isLocationStale: targetLoc?.isStale ?? false,
        accuracyCategory: targetLoc?.accuracyCategory ?? 'unknown',
        eventCreated: !!createdEventId,
        emailSent: apiResult.emailSent,
        emailStatus: apiResult.emailStatus,
        providerStatus: apiResult.providerStatus,
        messageId: apiResult.messageId || null,
        recipients: apiResult.recipients || (recipient ? [recipient] : []),
        backendAvailable: apiResult.backendAvailable,
        message: statusSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      return apiResult;
    } finally {
      isSosInFlightRef.current = false;
    }
  }, [currentLocation, user, userProfile, primaryEmergencyContact, validEmailContacts]);

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
    validEmailContacts,
    contactsLoading,
    currentLocation,
    locationError,
    isLocating,
    isWatchingLocation,
    getCurrentPosition,
    startWatchingLocation,
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

