import React, { useState } from 'react';
import { MessageSquare, Users, Heart, Share2, ShieldCheck, Lock, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const CommunityPage = () => {
  const [posts] = useState([
    {
      id: '1',
      author: 'Elena R. (Verified Member)',
      time: '2 hours ago',
      title: 'Safe Walking Group in Central City District',
      content: 'Organizing a weekend evening walk group for women in the Central district. Reply if interested in joining!',
      likes: 18,
      comments: 5
    },
    {
      id: '2',
      author: 'Anonymous Community Member',
      time: '5 hours ago',
      title: 'Best Natural Remedies for PMS Cramps?',
      content: 'Looking for advice on holistic dietary adjustments or heat therapy routines for cycle days 1-2.',
      likes: 24,
      comments: 12
    }
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="secondary" icon={Users}>
            Moderated Network
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            SecureHer Support Community
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            A safe digital space to discuss safety tips, health questions, and peer support with zero location exposure.
          </p>
        </div>
        <Button variant="primary" icon={Plus}>
          New Post
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {posts.map((post) => (
          <Card key={post.id} hoverEffect={true} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {post.author}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{post.time}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {post.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {post.content}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(246, 221, 229, 0.6)', paddingTop: '0.85rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <Heart size={16} color="var(--color-secondary)" /> {post.likes} Likes
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <MessageSquare size={16} color="var(--color-primary)" /> {post.comments} Comments
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
