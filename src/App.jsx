import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { HealthProvider } from './context/HealthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SafetyProvider>
          <HealthProvider>
            <AppProvider>
              <AppRoutes />
            </AppProvider>
          </HealthProvider>
        </SafetyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
