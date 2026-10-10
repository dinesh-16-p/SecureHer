import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import OfflineIndicator from './components/common/OfflineIndicator';
import PwaInstallBanner from './components/common/PwaInstallBanner';
import { registerServiceWorker } from './services/pwa/pwaService';

function App() {
  useEffect(() => {
    // Safely register PWA Service Worker
    registerServiceWorker((registration) => {
      console.info('SecureHer update available. Refresh to apply latest version.');
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <SafetyProvider>
          <AppProvider>
            <OfflineIndicator />
            <AppRoutes />
            <PwaInstallBanner />
          </AppProvider>
        </SafetyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

