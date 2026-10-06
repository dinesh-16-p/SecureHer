import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';

// Protected Module Pages
import DashboardPage from '../pages/Dashboard/DashboardPage';

import SafetyPage from '../pages/Safety/SafetyPage';
import SOSPage from '../pages/Safety/SOSPage';
import EmergencyContactsPage from '../pages/Safety/EmergencyContactsPage';
import LocationPage from '../pages/Safety/LocationPage';
import HelplinesPage from '../pages/Safety/HelplinesPage';

import HealthPage from '../pages/Health/HealthPage';
import PeriodTrackerPage from '../pages/Health/PeriodTrackerPage';
import HealthCalendarPage from '../pages/Health/HealthCalendarPage';
import MoodPage from '../pages/Health/MoodPage';
import MedicationPage from '../pages/Health/MedicationPage';
import AppointmentsPage from '../pages/Health/AppointmentsPage';

import CommunityPage from '../pages/Community/CommunityPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';

import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Sub-sections */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<LandingPage />} />
      <Route path="/safety" element={<LandingPage />} />
      <Route path="/health" element={<LandingPage />} />
      <Route path="/community" element={<LandingPage />} />
      <Route path="/about" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Application Routes wrapped in AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Safety Routes */}
      <Route
        path="/safety"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SafetyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/sos"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SOSPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/contacts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EmergencyContactsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/location"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LocationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/helplines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HelplinesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Health Routes */}
      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HealthPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/period"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PeriodTrackerPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/calendar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HealthCalendarPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/mood"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MoodPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/medication"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MedicationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health/appointments"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AppointmentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Community */}
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommunityPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Account: Profile & Settings */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
