import React from 'react';
import Navbar from '../../components/navigation/Navbar';
import HeroSection from './HeroSection';
import WhySection from './WhySection';
import SafetySection from './SafetySection';
import HealthSection from './HealthSection';
import CommunitySection from './CommunitySection';
import HowItWorksSection from './HowItWorksSection';
import CtaSection from './CtaSection';
import Footer from '../../components/layout/Footer';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <WhySection />
        <SafetySection />
        <HealthSection />
        <CommunitySection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
