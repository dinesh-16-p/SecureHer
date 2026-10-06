import React from 'react';
import { Users, MessageSquare, ShieldCheck, Heart, Share2, Lock } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const CommunitySection = () => {
  const communityPillars = [
    {
      icon: MessageSquare,
      title: 'Peer Support Discussions',
      description: 'Share safety tips, health advice, and personal experiences in a respectful, supportive environment moderated for safety.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Anonymous Options',
      description: 'Choose whether to post under your profile name or post anonymously when sharing sensitive safety or health experiences.',
    },
    {
      icon: Lock,
      title: 'Zero Public Location Leakage',
      description: 'Your precise location is never exposed in community posts or discussions. Safety & anonymity remain paramount.',
    },
    {
      icon: Heart,
      title: 'Empathy & Shared Awareness',
      description: 'Connect with fellow women in your city or interest groups for local safety updates and wellness recommendations.',
    }
  ];

  return (
    <section
      id="community"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-background)',
        position: 'relative'
      }}
    >
      <div className="container">
        <SectionHeading
          badgeText="Supportive Network"
          badgeIcon={Users}
          badgeVariant="secondary"
          title="Safe, Moderated Women Community"
          subtitle="A respectful digital space where women connect, share safety advice, discuss health topics, and support one another."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}
        >
          {communityPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} hoverEffect={true} padding="lg">
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(199, 91, 122, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-secondary)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
