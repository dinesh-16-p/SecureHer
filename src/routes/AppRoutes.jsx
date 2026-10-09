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
import JourneyPage from '../pages/Safety/JourneyPage';
import NearbyServicesPage from '../pages/Safety/NearbyServicesPage';
import EvidenceCameraPage from '../pages/Safety/EvidenceCameraPage';
import EvidenceHistoryPage from '../pages/Safety/EvidenceHistoryPage';
import IncidentReportsPage from '../pages/Safety/IncidentReportsPage';
import FakeCallPage from '../pages/Safety/FakeCallPage';
import HelplinesPage from '../pages/Safety/HelplinesPage';

import CommunityPage from '../pages/Community/CommunityPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';

import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

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

      {/* Security Routes */}
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
        path="/safety/journey"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JourneyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/nearby"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NearbyServicesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/evidence"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EvidenceCameraPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/evidence-history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EvidenceHistoryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/incidents"
        element={
          <ProtectedRoute>
            <AppLayout>
              <IncidentReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety/fake-call"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FakeCallPage />
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
