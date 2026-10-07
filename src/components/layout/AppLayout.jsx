import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';
import SecureHerAI from '../ai/SecureHerAI';

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar setMobileOpen={setMobileOpen} />
        
        <main
          style={{
            flex: 1,
            padding: '2rem 1.5rem 6rem 1.5rem',
            maxWidth: '1300px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {children}
        </main>
      </div>

      {/* Floating AI Assistant */}
      <SecureHerAI />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Responsive Drawer Overlay styling */}
      <style>{`
        @media (max-width: 767px) {
          .app-sidebar {
            position: fixed !important;
            top: 0;
            left: -280px;
            bottom: 0;
            z-index: 1000;
            transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            box-shadow: var(--shadow-lg);
          }
          .app-sidebar.open {
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
