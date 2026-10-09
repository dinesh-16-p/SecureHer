/**
 * Firestore Service Layer
 * Clean, decoupled CRUD operations for all user-scoped and global collections.
 * Uses real-time snapshot listeners with unsubscribe returns.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ----------------------------------------------------------------------
// 1. EMERGENCY CONTACTS (users/{uid}/emergencyContacts)
// ----------------------------------------------------------------------

export const subscribeEmergencyContacts = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const contactsRef = collection(db, 'users', uid, 'emergencyContacts');
  const q = query(contactsRef, orderBy('priority', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const contacts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(contacts);
    },
    (err) => {
      console.error('Error fetching emergency contacts:', err);
      if (onError) onError(err);
    }
  );
};

export const addEmergencyContact = async (uid, contactData) => {
  if (!uid) throw new Error('User not authenticated');
  const contactsRef = collection(db, 'users', uid, 'emergencyContacts');
  const docRef = await addDoc(contactsRef, {
    ...contactData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateEmergencyContact = async (uid, contactId, contactData) => {
  if (!uid || !contactId) throw new Error('Invalid arguments');
  const contactRef = doc(db, 'users', uid, 'emergencyContacts', contactId);
  await updateDoc(contactRef, {
    ...contactData,
    updatedAt: serverTimestamp()
  });
};

export const deleteEmergencyContact = async (uid, contactId) => {
  if (!uid || !contactId) throw new Error('Invalid arguments');
  const contactRef = doc(db, 'users', uid, 'emergencyContacts', contactId);
  await deleteDoc(contactRef);
};

// ----------------------------------------------------------------------
// 2. SAFETY EVENTS (users/{uid}/safetyEvents)
// ----------------------------------------------------------------------

export const logSafetyEvent = async (uid, eventData) => {
  if (!uid) throw new Error('User not authenticated');
  const eventsRef = collection(db, 'users', uid, 'safetyEvents');
  const docRef = await addDoc(eventsRef, {
    type: eventData.type || 'SOS',
    status: eventData.status || 'activated',
    latitude: eventData.latitude ?? null,
    longitude: eventData.longitude ?? null,
    accuracy: eventData.accuracy ?? null,
    emailStatus: eventData.emailStatus || 'pending',
    recipientEmail: eventData.recipientEmail || null,
    backendMessage: eventData.backendMessage || null,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateSafetyEvent = async (uid, eventId, updateData) => {
  if (!uid || !eventId) return;
  const eventRef = doc(db, 'users', uid, 'safetyEvents', eventId);
  await updateDoc(eventRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
};

// ----------------------------------------------------------------------
// 3. HEALTH: PERIODS (users/{uid}/health/periods)
// ----------------------------------------------------------------------

export const subscribePeriods = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const periodsRef = collection(db, 'users', uid, 'health', 'periods', 'logs');
  const q = query(periodsRef, orderBy('startDate', 'desc'), limit(12));

  return onSnapshot(
    q,
    (snapshot) => {
      const periods = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(periods);
    },
    (err) => {
      console.error('Error fetching period history:', err);
      if (onError) onError(err);
    }
  );
};

export const savePeriodEntry = async (uid, periodData) => {
  if (!uid) throw new Error('User not authenticated');
  const periodsRef = collection(db, 'users', uid, 'health', 'periods', 'logs');
  const docRef = await addDoc(periodsRef, {
    startDate: periodData.startDate, // YYYY-MM-DD
    endDate: periodData.endDate || null,
    cycleLength: Number(periodData.cycleLength) || 28,
    periodLength: Number(periodData.periodLength) || 5,
    flow: periodData.flow || 'Medium',
    symptoms: periodData.symptoms || [],
    notes: periodData.notes || '',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const deletePeriodEntry = async (uid, periodId) => {
  if (!uid || !periodId) return;
  const periodRef = doc(db, 'users', uid, 'health', 'periods', 'logs', periodId);
  await deleteDoc(periodRef);
};

// ----------------------------------------------------------------------
// 4. HEALTH: MOODS (users/{uid}/health/moods)
// ----------------------------------------------------------------------

export const subscribeMoods = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const moodsRef = collection(db, 'users', uid, 'health', 'moods', 'logs');
  const q = query(moodsRef, orderBy('createdAt', 'desc'), limit(14));

  return onSnapshot(
    q,
    (snapshot) => {
      const moods = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(moods);
    },
    (err) => {
      console.error('Error fetching mood history:', err);
      if (onError) onError(err);
    }
  );
};

export const saveMoodEntry = async (uid, moodData) => {
  if (!uid) throw new Error('User not authenticated');
  const moodsRef = collection(db, 'users', uid, 'health', 'moods', 'logs');
  const docRef = await addDoc(moodsRef, {
    mood: moodData.mood,
    emoji: moodData.emoji || '😊',
    note: moodData.note || '',
    date: moodData.date || new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

// ----------------------------------------------------------------------
// 5. HEALTH: MEDICATIONS (users/{uid}/health/medications)
// ----------------------------------------------------------------------

export const subscribeMedications = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const medsRef = collection(db, 'users', uid, 'health', 'medications', 'logs');
  const q = query(medsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const meds = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(meds);
    },
    (err) => {
      console.error('Error fetching medications:', err);
      if (onError) onError(err);
    }
  );
};

export const saveMedication = async (uid, medData) => {
  if (!uid) throw new Error('User not authenticated');
  const medsRef = collection(db, 'users', uid, 'health', 'medications', 'logs');
  const docRef = await addDoc(medsRef, {
    name: medData.name,
    dosage: medData.dosage || '1 Dose',
    time: medData.time || '08:00 AM',
    status: medData.status || 'Pending', // 'Pending' | 'Taken'
    active: true,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const toggleMedicationStatus = async (uid, medId, newStatus) => {
  if (!uid || !medId) return;
  const medRef = doc(db, 'users', uid, 'health', 'medications', 'logs', medId);
  await updateDoc(medRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
};

export const deleteMedication = async (uid, medId) => {
  if (!uid || !medId) return;
  const medRef = doc(db, 'users', uid, 'health', 'medications', 'logs', medId);
  await deleteDoc(medRef);
};

// ----------------------------------------------------------------------
// 6. HEALTH: APPOINTMENTS (users/{uid}/health/appointments)
// ----------------------------------------------------------------------

export const subscribeAppointments = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const apptsRef = collection(db, 'users', uid, 'health', 'appointments', 'logs');
  const q = query(apptsRef, orderBy('date', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const appts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(appts);
    },
    (err) => {
      console.error('Error fetching appointments:', err);
      if (onError) onError(err);
    }
  );
};

export const saveAppointment = async (uid, apptData) => {
  if (!uid) throw new Error('User not authenticated');
  const apptsRef = collection(db, 'users', uid, 'health', 'appointments', 'logs');
  const docRef = await addDoc(apptsRef, {
    doctor: apptData.doctor,
    specialty: apptData.specialty || 'General Practitioner',
    date: apptData.date,
    time: apptData.time || '10:00 AM',
    location: apptData.location || '',
    notes: apptData.notes || '',
    status: 'Upcoming',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const deleteAppointment = async (uid, apptId) => {
  if (!uid || !apptId) return;
  const apptRef = doc(db, 'users', uid, 'health', 'appointments', 'logs', apptId);
  await deleteDoc(apptRef);
};

// ----------------------------------------------------------------------
// 7. COMMUNITY POSTS (communityPosts/{postId})
// ----------------------------------------------------------------------

export const subscribeCommunityPosts = (onUpdate, onError) => {
  const postsRef = collection(db, 'communityPosts');
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(posts);
    },
    (err) => {
      console.error('Error subscribing to community posts:', err);
      if (onError) onError(err);
    }
  );
};

export const createCommunityPost = async (uid, authorName, isAnonymous, postData) => {
  if (!uid) throw new Error('User not authenticated');
  const postsRef = collection(db, 'communityPosts');
  const docRef = await addDoc(postsRef, {
    authorId: uid,
    authorName: isAnonymous ? 'Anonymous' : (authorName || 'Community Member'),
    isAnonymous: !!isAnonymous,
    category: postData.category || 'General',
    title: postData.title,
    body: postData.body,
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const togglePostLike = async (postId, uid, hasLiked) => {
  if (!postId || !uid) return;
  const postRef = doc(db, 'communityPosts', postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;

  const data = postSnap.data();
  let likedBy = Array.isArray(data.likedBy) ? [...data.likedBy] : [];

  if (hasLiked) {
    likedBy = likedBy.filter((id) => id !== uid);
  } else {
    if (!likedBy.includes(uid)) {
      likedBy.push(uid);
    }
  }

  await updateDoc(postRef, {
    likedBy,
    likesCount: likedBy.length
  });
};

// ----------------------------------------------------------------------
// 8. NOTIFICATIONS (users/{uid}/notifications)
// ----------------------------------------------------------------------

export const subscribeNotifications = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const notifRef = collection(db, 'users', uid, 'notifications');
  const q = query(notifRef, orderBy('createdAt', 'desc'), limit(30));

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(notifications);
    },
    (err) => {
      console.error('Error subscribing to notifications:', err);
      if (onError) onError(err);
    }
  );
};

export const createNotification = async (uid, notifData) => {
  if (!uid) return;
  const notifRef = collection(db, 'users', uid, 'notifications');
  await addDoc(notifRef, {
    title: notifData.title,
    message: notifData.message,
    type: notifData.type || 'info', // 'emergency' | 'health' | 'info' | 'system'
    read: false,
    createdAt: serverTimestamp()
  });
};

export const markNotificationAsRead = async (uid, notifId) => {
  if (!uid || !notifId) return;
  const notifRef = doc(db, 'users', uid, 'notifications', notifId);
  await updateDoc(notifRef, {
    read: true,
    readAt: serverTimestamp()
  });
};

// ----------------------------------------------------------------------
// 9. TRUSTED JOURNEYS (users/{uid}/journeys)
// ----------------------------------------------------------------------

export const subscribeJourneys = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const journeysRef = collection(db, 'users', uid, 'journeys');
  const q = query(journeysRef, orderBy('createdAt', 'desc'), limit(30));

  return onSnapshot(
    q,
    (snapshot) => {
      const journeys = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(journeys);
    },
    (err) => {
      console.error('Error fetching journeys:', err);
      if (onError) onError(err);
    }
  );
};

export const createJourney = async (uid, journeyData) => {
  if (!uid) throw new Error('User not authenticated');
  const journeysRef = collection(db, 'users', uid, 'journeys');
  const docRef = await addDoc(journeysRef, {
    ownerUid: uid,
    title: journeyData.title || 'Untitled Journey',
    destinationLabel: journeyData.destinationLabel || '',
    destinationLatitude: journeyData.destinationLatitude ?? null,
    destinationLongitude: journeyData.destinationLongitude ?? null,
    startLabel: journeyData.startLabel || 'Current Location',
    startLatitude: journeyData.startLatitude ?? null,
    startLongitude: journeyData.startLongitude ?? null,
    startedAt: journeyData.startedAt || new Date().toISOString(),
    expectedArrivalAt: journeyData.expectedArrivalAt || null,
    lastLatitude: journeyData.lastLatitude ?? journeyData.startLatitude ?? null,
    lastLongitude: journeyData.lastLongitude ?? journeyData.startLongitude ?? null,
    lastLocationAt: new Date().toISOString(),
    locationAccuracyMeters: journeyData.locationAccuracyMeters ?? null,
    status: journeyData.status || 'active', // 'planned' | 'active' | 'paused' | 'completed' | 'cancelled'
    selectedContactIds: journeyData.selectedContactIds || [],
    notes: journeyData.notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateJourneyLocation = async (uid, journeyId, locationData) => {
  if (!uid || !journeyId) return;
  const journeyRef = doc(db, 'users', uid, 'journeys', journeyId);
  await updateDoc(journeyRef, {
    lastLatitude: locationData.latitude,
    lastLongitude: locationData.longitude,
    locationAccuracyMeters: locationData.accuracy ?? null,
    lastLocationAt: new Date().toISOString(),
    updatedAt: serverTimestamp()
  });
};

export const updateJourneyStatus = async (uid, journeyId, status, extraData = {}) => {
  if (!uid || !journeyId) return;
  const journeyRef = doc(db, 'users', uid, 'journeys', journeyId);
  const updatePayload = {
    status,
    updatedAt: serverTimestamp(),
    ...extraData
  };
  if (status === 'completed') {
    updatePayload.completedAt = new Date().toISOString();
  }
  await updateDoc(journeyRef, updatePayload);
};

export const deleteJourney = async (uid, journeyId) => {
  if (!uid || !journeyId) return;
  const journeyRef = doc(db, 'users', uid, 'journeys', journeyId);
  await deleteDoc(journeyRef);
};

// ----------------------------------------------------------------------
// 10. SAFETY INCIDENT REPORTS (users/{uid}/incidentReports)
// ----------------------------------------------------------------------

export const subscribeIncidentReports = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const reportsRef = collection(db, 'users', uid, 'incidentReports');
  const q = query(reportsRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onUpdate(reports);
    },
    (err) => {
      console.error('Error fetching incident reports:', err);
      if (onError) onError(err);
    }
  );
};

export const createIncidentReport = async (uid, reportData) => {
  if (!uid) throw new Error('User not authenticated');
  const reportsRef = collection(db, 'users', uid, 'incidentReports');
  const docRef = await addDoc(reportsRef, {
    ownerUid: uid,
    incidentType: reportData.incidentType || 'Other safety concern',
    title: reportData.title || `${reportData.incidentType || 'Safety'} Report`,
    incidentAt: reportData.incidentAt || new Date().toISOString(),
    locationLabel: reportData.locationLabel || '',
    latitude: reportData.latitude ?? null,
    longitude: reportData.longitude ?? null,
    locationAccuracyMeters: reportData.locationAccuracyMeters ?? null,
    description: reportData.description || '',
    notes: reportData.notes || '',
    evidenceIds: reportData.evidenceIds || [],
    status: reportData.status || 'saved', // 'draft' | 'saved' | 'archived'
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateIncidentReport = async (uid, reportId, updateData) => {
  if (!uid || !reportId) return;
  const reportRef = doc(db, 'users', uid, 'incidentReports', reportId);
  await updateDoc(reportRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
};

export const deleteIncidentReport = async (uid, reportId) => {
  if (!uid || !reportId) return;
  const reportRef = doc(db, 'users', uid, 'incidentReports', reportId);
  await deleteDoc(reportRef);
};

