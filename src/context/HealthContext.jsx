import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribePeriods,
  savePeriodEntry,
  deletePeriodEntry,
  subscribeMoods,
  saveMoodEntry,
  subscribeMedications,
  saveMedication,
  toggleMedicationStatus,
  deleteMedication,
  subscribeAppointments,
  saveAppointment,
  deleteAppointment
} from '../services/firebase/firestoreService';

const HealthContext = createContext();

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider = ({ children }) => {
  const { user } = useAuth();

  const [periods, setPeriods] = useState([]);
  const [moods, setMoods] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore subscriptions
  useEffect(() => {
    if (!user) {
      setPeriods([]);
      setMoods([]);
      setMedications([]);
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubPeriods = subscribePeriods(user.uid, (data) => setPeriods(data));
    const unsubMoods = subscribeMoods(user.uid, (data) => setMoods(data));
    const unsubMeds = subscribeMedications(user.uid, (data) => setMedications(data));
    const unsubAppts = subscribeAppointments(user.uid, (data) => {
      setAppointments(data);
      setLoading(false);
    });

    return () => {
      unsubPeriods();
      unsubMoods();
      unsubMeds();
      unsubAppts();
    };
  }, [user]);

  // Derived Cycle Analytics based on authentic user period logs
  const cycleSummary = useMemo(() => {
    if (!periods || periods.length === 0) {
      return {
        hasData: false,
        currentDay: null,
        phase: 'No Data Logged',
        phaseDescription: 'Log your period start date to calculate your cycle summary and phase.',
        nextPeriodDate: null,
        ovulationStart: null,
        ovulationEnd: null,
        cycleLength: 28,
        periodLength: 5,
        latestPeriod: null
      };
    }

    const latest = periods[0];
    const cycleLength = Number(latest.cycleLength) || 28;
    const periodLength = Number(latest.periodLength) || 5;

    const startDate = new Date(latest.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1-indexed

    // Calculate current cycle day (cycles repeat every cycleLength days)
    let currentDay = diffDays > 0 ? ((diffDays - 1) % cycleLength) + 1 : 1;

    // Determine Cycle Phase
    let phase = 'Follicular Phase';
    let phaseDescription = 'Rising estrogen and sustained energy.';
    let phaseColor = 'var(--color-secondary)';

    if (currentDay <= periodLength) {
      phase = 'Menstrual Phase';
      phaseDescription = 'Active flow phase. Prioritize rest and hydration.';
      phaseColor = '#D92D3A';
    } else if (currentDay < 14) {
      phase = 'Follicular Phase';
      phaseDescription = 'Estrogen rises, energy and focus increase.';
      phaseColor = '#C75B7A';
    } else if (currentDay >= 14 && currentDay <= 16) {
      phase = 'Ovulation Phase';
      phaseDescription = 'Peak fertility window and hormonal peak.';
      phaseColor = '#9B6B8F';
    } else {
      phase = 'Luteal Phase';
      phaseDescription = 'Progesterone dominates; wind down and nourish your body.';
      phaseColor = '#5B214F';
    }

    // Estimated Next Period Date
    const nextDate = new Date(startDate);
    // Find next period start date in future
    while (nextDate <= today) {
      nextDate.setDate(nextDate.getDate() + cycleLength);
    }

    // Ovulation Window (typically days 12-16 from start)
    const ovuStart = new Date(nextDate);
    ovuStart.setDate(ovuStart.getDate() - cycleLength + 12);
    const ovuEnd = new Date(nextDate);
    ovuEnd.setDate(ovuEnd.getDate() - cycleLength + 16);

    const formatDate = (d) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      hasData: true,
      currentDay,
      phase,
      phaseDescription,
      phaseColor,
      nextPeriodDate: formatDate(nextDate),
      ovulationStart: formatDate(ovuStart),
      ovulationEnd: formatDate(ovuEnd),
      cycleLength,
      periodLength,
      latestPeriod: latest
    };
  }, [periods]);

  // Operations
  const logPeriod = async (data) => {
    if (!user) throw new Error('User not authenticated');
    return await savePeriodEntry(user.uid, data);
  };

  const removePeriod = async (id) => {
    if (!user) throw new Error('User not authenticated');
    return await deletePeriodEntry(user.uid, id);
  };

  const logMood = async (data) => {
    if (!user) throw new Error('User not authenticated');
    return await saveMoodEntry(user.uid, data);
  };

  const addMed = async (data) => {
    if (!user) throw new Error('User not authenticated');
    return await saveMedication(user.uid, data);
  };

  const toggleMed = async (id, currentStatus) => {
    if (!user) throw new Error('User not authenticated');
    const newStatus = currentStatus === 'Taken' ? 'Pending' : 'Taken';
    return await toggleMedicationStatus(user.uid, id, newStatus);
  };

  const removeMed = async (id) => {
    if (!user) throw new Error('User not authenticated');
    return await deleteMedication(user.uid, id);
  };

  const addAppt = async (data) => {
    if (!user) throw new Error('User not authenticated');
    return await saveAppointment(user.uid, data);
  };

  const removeAppt = async (id) => {
    if (!user) throw new Error('User not authenticated');
    return await deleteAppointment(user.uid, id);
  };

  const value = {
    periods,
    moods,
    medications,
    appointments,
    cycleSummary,
    loading,
    logPeriod,
    removePeriod,
    logMood,
    addMed,
    toggleMed,
    removeMed,
    addAppt,
    removeAppt
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

export default HealthContext;
