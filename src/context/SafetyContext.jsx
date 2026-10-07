import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    locationObtained: false,
    eventCreated: false,
    emailSent: false,
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

  // Primary emergency contact (priority #1 or first contact)
  const primaryEmergencyContact = emergencyContacts.length > 0 ? emergencyContacts[0] : null;

  // Manual trigger to request / refresh location
  const getCurrentPosition = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const loc = await requestLocationAccess();
      setCurrentLocation(loc);
      setIsLocating(false);
      refreshPermissions();
      return loc;
    } catch (err) {
      setLocationError(err.message || 'Unable to retrieve location');
      setIsLocating(false);
      refreshPermissions();
      return null;
    }
  }, [refreshPermissions]);

  // Start live location watch
  const startWatchingLocation = useCallback(() => {
    if (isWatchingLocation) return () => {};
    setIsWatchingLocation(true);

    const watchId = watchLocationAccess(
      (pos) => {
        setCurrentLocation(pos);
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message || 'Location watch error');
      }
    );

    return () => {
      clearLocationWatch(watchId);
      setIsWatchingLocation(false);
    };
  }, [isWatchingLocation]);

  // Emergency SOS Activation
  const triggerSOS = useCallback(async () => {
    setSosActive(true);
    
    // 1. Play Emergency Siren Sound immediately upon user trigger
    sosAlarm.play();

    setSosStatus({
      alarmPlaying: true,
      locationObtained: false,
      eventCreated: false,
      emailSent: false,
      backendAvailable: null,
      message: 'SOS Initiated. Disptaching alert...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 2. Fetch freshest GPS coordinates
    let freshLoc = currentLocation;
    try {
      freshLoc = await requestLocationAccess();
      setCurrentLocation(freshLoc);
    } catch (locErr) {
      console.warn('SOS location fetch note:', locErr.message);
    }

    // 3. Log Safety Event in Firestore under users/{uid}/safetyEvents
    let createdEventId = null;
    const recipient = primaryEmergencyContact?.email || null;
    const recipientName = primaryEmergencyContact?.name || null;

    if (user) {
      try {
        createdEventId = await logSafetyEvent(user.uid, {
          type: 'SOS',
          status: 'activated',
          latitude: freshLoc?.latitude ?? null,
          longitude: freshLoc?.longitude ?? null,
          accuracy: freshLoc?.accuracy ?? null,
          recipientEmail: recipient,
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
      latitude: freshLoc?.latitude,
      longitude: freshLoc?.longitude,
      accuracy: freshLoc?.accuracy,
      recipientEmail: recipient,
      recipientName: recipientName,
      userName: userProfile?.fullName || user?.displayName || 'SecureHer User',
      userPhone: userProfile?.phone || ''
    });

    // 5. Update Firestore event with backend dispatch result
    if (user && createdEventId) {
      await updateSafetyEvent(user.uid, createdEventId, {
        emailStatus: apiResult.emailSent ? 'sent' : 'failed',
        backendMessage: apiResult.message
      });
    }

    // 6. Update UI Status State
    setSosStatus({
      alarmPlaying: true,
      locationObtained: !!freshLoc,
      eventCreated: !!createdEventId,
      emailSent: apiResult.emailSent,
      backendAvailable: apiResult.backendAvailable,
      message: apiResult.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return apiResult;
  }, [currentLocation, user, userProfile, primaryEmergencyContact]);

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
      message: 'SOS Deactivated'
    }));
  }, [user, sosEventId]);

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
    contactsLoading,
    currentLocation,
    locationError,
    isLocating,
    getCurrentPosition,
    startWatchingLocation,
    permissions,
    refreshPermissions,
    sosActive,
    sosStatus,
    triggerSOS,
    cancelSOS,
    addContact,
    removeContact,
    editContact
  };

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
};

export default SafetyContext;
