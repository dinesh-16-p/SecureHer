import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Plus, Shield, Eye, EyeOff, Send, Flame, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const SAMPLE_THREADS = [
  {
    id: '1',
    author: 'Priya S.',
    anonymous: false,
    avatar: 'PS',
    time: '2 hours ago',
    category: 'Safety Tip',
    title: 'Share your safe route home — Banjara Hills area',
    body: 'I found that taking the lane behind D-Mart is much safer after 9 PM because there are security cameras and a 24/7 medical store. Please share if you know other safe corridors!',
    likes: 47,
    comments: 12,
    liked: false,
    color: '#5B214F'
  },
  {
    id: '2',
    author: 'Anonymous',
    anonymous: true,
    avatar: '?',
    time: '5 hours ago',
    category: 'Health Support',
    title: 'Severe PCOS symptoms — looking for advice',
    body: 'Dealing with very irregular cycles and significant pain this month. My doctor appointment is next week. Has anyone tried inositol supplements? Would appreciate any community advice while I wait.',
    likes: 83,
    comments: 29,
    liked: false,
    color: '#C75B7A'
  },
  {
    id: '3',
    author: 'Sneha R.',
    anonymous: false,
    avatar: 'SR',
    time: '1 day ago',
    category: 'Success Story',
    title: 'SecureHer SOS actually worked! 🙏',
    body: 'Last Thursday night my auto driver took a completely different route. I activated SOS and my mom got the live location instantly. She called the police helpline and I got home safely. This app saved me.',
    likes: 214,
    comments: 56,
    liked: true,
    color: '#2E7D32'
  },
  {
    id: '4',
    author: 'Anonymous',
    anonymous: true,
    avatar: '?',
    time: '2 days ago',
    category: 'Mental Health',
    title: 'Feeling constantly anxious about commuting alone',
    body: 'I have a 45-minute commute alone every day and I am always on edge. Any tips to feel safer or to manage the anxiety? I do not always want to feel this way.',
    likes: 102,
    comments: 38,
    liked: false,
    color: '#9B6B8F'
  }
];

const categories = ['All', 'Safety Tip', 'Health Support', 'Success Story', 'Mental Health', 'General'];

const CommunityPage = () => {
  const [threads, setThreads] = useState(SAMPLE_THREADS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const filtered = activeCategory === 'All' ? threads : threads.filter(t => t.category === activeCategory);

  const handleLike = (id) => {
    setThreads(prev => prev.map(t =>
      t.id === id ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 } : t
    ));
  };

  const handlePost = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    const newThread = {
      id: Date.now().toString(),
      author: isAnonymous ? 'Anonymous' : 'You',
      anonymous: isAnonymous,
      avatar: isAnonymous ? '?' : 'YO',
      time: 'Just now',
      category: newCategory,
      title: newTitle,
      body: newBody,
      likes: 0,
      comments: 0,
      liked: false,
      color: '#5B214F'
    };
    setThreads(prev => [newThread, ...prev]);
    setNewTitle('');
    setNewBody('');
    setShowNewPost(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="primary" icon={Users}>Peer Community</Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Community Threads
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            A safe, verified space for women to share safety tips, health advice, and support.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowNewPost(true)}>
          New Thread
        </Button>
      </div>

      {/* Privacy Notice */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(91,33,79,0.06) 0%, rgba(199,91,122,0.06) 100%)',
        border: '1px solid rgba(91,33,79,0.15)',
        borderRadius: '12px',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Shield size={18} color="var(--color-primary)" />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--color-primary)' }}>Privacy Protected:</strong> Your real name is never shown without your consent. Location data is never shared in threads.
        </p>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <Card padding="lg" style={{ marginBottom: '1.5rem', border: '2px solid rgba(91,33,79,0.2)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Create New Thread
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.9rem', color: 'var(--color-primary)', background: '#fff' }}
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Thread title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.95rem', color: 'var(--color-primary)', outline: 'none' }}
            />
            <textarea
              placeholder="Share your story, tip, or question..."
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              rows={4}
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.9rem', color: 'var(--color-text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setIsAnonymous(prev => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: isAnonymous ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}
              >
                {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                {isAnonymous ? 'Posting Anonymously' : 'Post as Anonymous'}
              </button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>Cancel</Button>
                <Button variant="primary" size="sm" icon={Send} onClick={handlePost}>Post Thread</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '100px',
              border: activeCategory === cat ? 'none' : '1.5px solid rgba(91,33,79,0.2)',
              background: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
              color: activeCategory === cat ? '#fff' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Thread List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map(thread => (
          <Card key={thread.id} hoverEffect={true} padding="lg">
            {/* Thread Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: thread.anonymous ? 'rgba(155,107,143,0.15)' : `${thread.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.8rem', color: thread.anonymous ? 'var(--color-health)' : thread.color
                }}>
                  {thread.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{thread.author}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={11} /> {thread.time}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '0.2rem 0.75rem', borderRadius: '100px',
                background: `${thread.color}15`, color: thread.color,
                fontSize: '0.75rem', fontWeight: 700
              }}>
                {thread.category}
              </span>
            </div>

            {/* Thread Body */}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {thread.title}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {thread.body}
            </p>

            {/* Thread Actions */}
            <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(246,221,229,0.6)' }}>
              <button
                onClick={() => handleLike(thread.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: thread.liked ? '#D92D3A' : 'var(--color-text-muted)',
                  fontWeight: 600, fontSize: '0.875rem', transition: 'color 0.2s'
                }}
              >
                <Heart size={16} fill={thread.liked ? '#D92D3A' : 'none'} />
                {thread.likes}
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
                <MessageCircle size={16} />
                {thread.comments} Replies
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
