import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, Plus, Shield, Eye, EyeOff, Send, Clock, Sparkles } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  subscribeCommunityPosts,
  createCommunityPost,
  togglePostLike
} from '../../services/firebase/firestoreService';

const categories = ['All', 'Safety Tip', 'Health Support', 'Success Story', 'Mental Health', 'General'];

const CommunityPage = () => {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time community posts
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeCommunityPosts(
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      (err) => {
        console.warn('Community posts subscription note:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter((t) => t.category === activeCategory);

  const handleLike = async (postId) => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
    const hasLiked = likedBy.includes(user.uid);

    try {
      await togglePostLike(postId, user.uid, hasLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !user) return;

    setSubmitting(true);
    try {
      const authorName = userProfile?.fullName || user.displayName || 'Community Member';
      await createCommunityPost(user.uid, authorName, isAnonymous, {
        title: newTitle.trim(),
        body: newBody.trim(),
        category: newCategory
      });
      setNewTitle('');
      setNewBody('');
      setShowNewPost(false);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to format timestamps
  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return 'Recently';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="primary" icon={Users}>
            Peer Community
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Community Threads
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            A safe, verified space for women to share safety alerts, wellness experiences, and mutual support.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowNewPost(true)}>
          New Thread
        </Button>
      </div>

      {/* Privacy Notice */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(91,33,79,0.06) 0%, rgba(199,91,122,0.06) 100%)',
          border: '1px solid rgba(91,33,79,0.15)',
          borderRadius: '12px',
          padding: '0.875rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <Shield size={18} color="var(--color-primary)" />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--color-primary)' }}>Privacy Protected:</strong> Your email address is never displayed publicly. Choose anonymous posting anytime.
        </p>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card padding="lg" style={{ marginBottom: '1.5rem', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Create Community Thread
          </h3>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.9rem', color: 'var(--color-primary)', background: '#fff' }}
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Thread Title *"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.95rem', color: 'var(--color-primary)', outline: 'none' }}
            />
            <textarea
              placeholder="Share your safety tip, question, or story..."
              required
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={4}
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid rgba(91,33,79,0.2)', fontSize: '0.9rem', color: 'var(--color-text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsAnonymous((prev) => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: isAnonymous ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}
              >
                {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                {isAnonymous ? 'Posting Anonymously' : 'Post Anonymously'}
              </button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={Send} disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Thread'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
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

      {/* Thread List / Real Firestore Posts */}
      {loading ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading community threads...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(91, 33, 79, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--color-primary)'
            }}
          >
            <Users size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            No Community Posts Yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Be the first to share a safety recommendation, wellness experience, or discussion topic.
          </p>
          <Button variant="primary" icon={Plus} onClick={() => setShowNewPost(true)}>
            Start First Thread
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((thread) => {
            const likedBy = Array.isArray(thread.likedBy) ? thread.likedBy : [];
            const isLiked = user ? likedBy.includes(user.uid) : false;
            const likesCount = likedBy.length;

            return (
              <Card key={thread.id} hoverEffect={true} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(91, 33, 79, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: 'var(--color-primary)'
                      }}
                    >
                      {thread.isAnonymous ? '?' : thread.authorName ? thread.authorName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        {thread.authorName || (thread.isAnonymous ? 'Anonymous' : 'Community Member')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} /> {formatTime(thread.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.2rem 0.75rem',
                      borderRadius: '100px',
                      background: 'rgba(199, 91, 122, 0.15)',
                      color: 'var(--color-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {thread.category}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  {thread.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {thread.body}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(246,221,229,0.6)' }}>
                  <button
                    onClick={() => handleLike(thread.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isLiked ? '#D92D3A' : 'var(--color-text-muted)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      transition: 'color 0.2s'
                    }}
                  >
                    <Heart size={16} fill={isLiked ? '#D92D3A' : 'none'} />
                    {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
