import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  XCircle,
  Share2,
  RefreshCw,
  Trash2,
  Plus,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import {
  subscribeJourneys,
  createJourney,
  updateJourneyLocation,
  updateJourneyStatus,
  deleteJourney
} from '../../services/firebase/firestoreService';
import { shareJourneyProgress } from '../../services/api/safetyApi';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'BE8E5HFWGrNH05pGD0M4';
const MAPTILER_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`;

const JourneyPage = () => {
  const { user, userProfile } = useAuth();
  const { currentLocation, emergencyContacts, locationError, refreshPermissions } = useSafety();

  const [journeys, setJourneys] = useState([]);
  const [activeJourney, setActiveJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [destinationLat, setDestinationLat] = useState('');
  const [destinationLng, setDestinationLng] = useState('');
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState('30');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const isMapInitializedRef = useRef(false);

  // GPS Watcher Ref
  const locationWatcherRef = useRef(null);
  const lastWriteTimeRef = useRef(0);

  // 1. Subscribe to Firestore Journeys
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeJourneys(
      user.uid,
      (fetchedJourneys) => {
        setJourneys(fetchedJourneys);
        const active = fetchedJourneys.find((j) => j.status === 'active' || j.status === 'paused');
        setActiveJourney(active || null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching journeys:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  // 2. Throttled Background GPS Watcher when Active Journey is Running
  useEffect(() => {
    if (!activeJourney || activeJourney.status !== 'active' || !user?.uid) {
      if (locationWatcherRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(locationWatcherRef.current);
        locationWatcherRef.current = null;
      }
      return;
    }

    if ('geolocation' in navigator) {
      const handlePosition = (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const now = Date.now();
        // Throttle Firestore writes: update at most once every 15 seconds
        if (now - lastWriteTimeRef.current > 15000) {
          lastWriteTimeRef.current = now;
          updateJourneyLocation(user.uid, activeJourney.id, {
            latitude,
            longitude,
            accuracy: Math.round(accuracy)
          }).catch((err) => console.warn('Location update sync warning:', err));
        }

        // Update live map marker silently
        if (userMarkerRef.current && mapRef.current) {
          userMarkerRef.current.setLngLat([longitude, latitude]);
        }
      };

      locationWatcherRef.current = navigator.geolocation.watchPosition(
        handlePosition,
        (err) => console.warn('GPS watcher note:', err.message),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
    }

    return () => {
      if (locationWatcherRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(locationWatcherRef.current);
        locationWatcherRef.current = null;
      }
    };
  }, [activeJourney?.id, activeJourney?.status, user?.uid]);

  // 3. Initialize & update MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const initialLng = currentLocation?.longitude || 72.8777;
      const initialLat = currentLocation?.latitude || 19.0760;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAPTILER_STYLE,
        center: [initialLng, initialLat], // [lng, lat]
        zoom: 13
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      // User Position Marker
      const userEl = document.createElement('div');
      userEl.style.width = '20px';
      userEl.style.height = '20px';
      userEl.style.borderRadius = '50%';
      userEl.style.backgroundColor = '#5B214F';
      userEl.style.border = '3px solid #FFFFFF';
      userEl.style.boxShadow = '0 0 12px rgba(91, 33, 79, 0.6)';

      const userMarker = new maplibregl.Marker({ element: userEl })
        .setLngLat([initialLng, initialLat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML('<strong>Your Current Position</strong>'))
        .addTo(map);

      userMarkerRef.current = userMarker;
      mapRef.current = map;
      isMapInitializedRef.current = true;
    } else if (currentLocation && userMarkerRef.current) {
      userMarkerRef.current.setLngLat([currentLocation.longitude, currentLocation.latitude]);
    }

    // Add / Update Destination Marker if active
    if (mapRef.current && activeJourney?.destinationLatitude && activeJourney?.destinationLongitude) {
      const destLng = Number(activeJourney.destinationLongitude);
      const destLat = Number(activeJourney.destinationLatitude);

      if (!destMarkerRef.current) {
        const destEl = document.createElement('div');
        destEl.style.width = '24px';
        destEl.style.height = '24px';
        destEl.style.borderRadius = '50%';
        destEl.style.backgroundColor = '#D92D3A';
        destEl.style.border = '3px solid #FFFFFF';
        destEl.style.boxShadow = '0 0 14px rgba(217, 45, 58, 0.7)';

        const destMarker = new maplibregl.Marker({ element: destEl })
          .setLngLat([destLng, destLat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`<strong>Destination: ${activeJourney.destinationLabel}</strong>`))
          .addTo(mapRef.current);

        destMarkerRef.current = destMarker;
      } else {
        destMarkerRef.current.setLngLat([destLng, destLat]);
      }

      // Fit bounds to show both user and destination
      if (currentLocation) {
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([currentLocation.longitude, currentLocation.latitude]);
        bounds.extend([destLng, destLat]);
        mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 15 });
      }
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [currentLocation, activeJourney]);

  // Clean up map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Form Submission
  const handleStartJourney = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please provide a journey title (e.g., "Commute to Home").');
      return;
    }
    if (!destinationLabel.trim()) {
      setFormError('Please enter your destination address or landmark.');
      return;
    }

    const durationMins = parseInt(expectedDurationMinutes, 10);
    if (isNaN(durationMins) || durationMins <= 0) {
      setFormError('Please provide a valid expected duration in minutes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const arrivalDate = new Date(now.getTime() + durationMins * 60000);

      const journeyData = {
        title: title.trim(),
        destinationLabel: destinationLabel.trim(),
        destinationLatitude: destinationLat ? parseFloat(destinationLat) : null,
        destinationLongitude: destinationLng ? parseFloat(destinationLng) : null,
        startLabel: 'Current Location',
        startLatitude: currentLocation?.latitude ?? null,
        startLongitude: currentLocation?.longitude ?? null,
        startedAt: now.toISOString(),
        expectedArrivalAt: arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastLatitude: currentLocation?.latitude ?? null,
        lastLongitude: currentLocation?.longitude ?? null,
        locationAccuracyMeters: currentLocation?.accuracy ?? null,
        status: 'active',
        selectedContactIds: selectedContacts,
        notes: notes.trim()
      };

      await createJourney(user.uid, journeyData);
      setShowCreateModal(false);
      setTitle('');
      setDestinationLabel('');
      setDestinationLat('');
      setDestinationLng('');
      setNotes('');
    } catch (err) {
      setFormError(err.message || 'Could not start journey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePauseResume = async () => {
    if (!activeJourney || !user?.uid) return;
    const newStatus = activeJourney.status === 'active' ? 'paused' : 'active';
    await updateJourneyStatus(user.uid, activeJourney.id, newStatus);
  };

  const handleComplete = async () => {
    if (!activeJourney || !user?.uid) return;
    if (window.confirm('Check in as Safe & complete this journey?')) {
      await updateJourneyStatus(user.uid, activeJourney.id, 'completed');
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    }
  };

  const handleCancel = async () => {
    if (!activeJourney || !user?.uid) return;
    if (window.confirm('Are you sure you want to cancel this journey?')) {
      await updateJourneyStatus(user.uid, activeJourney.id, 'cancelled');
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    }
  };

  const handleDeletePast = async (journeyId) => {
    if (!user?.uid) return;
    if (window.confirm('Remove this journey record from your history?')) {
      await deleteJourney(user.uid, journeyId);
    }
  };

  const handleShareWithContacts = async () => {
    if (!activeJourney || !user) return;
    setShareLoading(true);
    setShareMessage(null);

    try {
      const idToken = await user.getIdToken();
      // Target emails: selected contacts or all contacts
      const targets = emergencyContacts.filter(
        (c) => activeJourney.selectedContactIds?.length === 0 || activeJourney.selectedContactIds?.includes(c.id)
      );

      if (targets.length === 0) {
        setShareMessage({
          type: 'warning',
          text: 'No emergency contacts with valid emails found. Please configure contacts in Safety → Emergency Contacts.'
        });
        setShareLoading(false);
        return;
      }

      let sentCount = 0;
      for (const contact of targets) {
        if (contact.email) {
          const res = await shareJourneyProgress({
            token: idToken,
            journeyTitle: activeJourney.title,
            destinationLabel: activeJourney.destinationLabel,
            status: activeJourney.status,
            latitude: currentLocation?.latitude ?? activeJourney.lastLatitude,
            longitude: currentLocation?.longitude ?? activeJourney.lastLongitude,
            expectedArrivalAt: activeJourney.expectedArrivalAt,
            recipientEmail: contact.email,
            recipientName: contact.name,
            userName: userProfile?.fullName || user.displayName || 'SecureHer User',
            notes: activeJourney.notes
          });
          if (res.success) sentCount++;
        }
      }

      setShareMessage({
        type: 'success',
        text: `Trip update email dispatched to ${sentCount} contact(s).`
      });
    } catch (err) {
      setShareMessage({
        type: 'error',
        text: err.message || 'Error dispatching journey email update.'
      });
    } finally {
      setShareLoading(false);
    }
  };

  // Check if overdue
  const isOverdue =
    activeJourney &&
    activeJourney.status === 'active' &&
    activeJourney.expectedArrivalAt &&
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) > activeJourney.expectedArrivalAt;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="primary" icon={Navigation}>
            Safety Module
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Trusted Journey Tracking
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Plan safe routes, share live travel progress with trusted contacts, and confirm on-time check-ins.
          </p>
        </div>

        {!activeJourney && (
          <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>
            Start New Journey
          </Button>
        )}
      </div>

      {/* Background Tab Limitation Notice */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(91, 33, 79, 0.05)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.5rem'
        }}
      >
        <Info size={18} />
        <span>
          <strong>Browser Geolocation Note:</strong> Continuous GPS tracking operates while this browser tab remains open. Keep the app visible or active on your device during transit.
        </span>
      </div>

      {/* Active Journey Card */}
      {activeJourney && (
        <Card
          padding="lg"
          style={{
            marginBottom: '2rem',
            border: isOverdue ? '2px solid var(--color-emergency)' : '2px solid var(--color-secondary)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9FB 100%)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: activeJourney.status === 'active' ? '#2E7D32' : 'var(--color-warning)'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  {activeJourney.status === 'active' ? 'Live Journey In Progress' : 'Journey Paused'}
                </span>
                {isOverdue && (
                  <Badge variant="emergency" icon={AlertTriangle}>
                    Overdue Arrival
                  </Badge>
                )}
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                {activeJourney.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant={activeJourney.status === 'active' ? 'outline' : 'secondary'}
                size="sm"
                icon={activeJourney.status === 'active' ? Pause : Play}
                onClick={handlePauseResume}
              >
                {activeJourney.status === 'active' ? 'Pause Sharing' : 'Resume Sharing'}
              </Button>
              <Button variant="secondary" size="sm" icon={CheckCircle2} onClick={handleComplete}>
                Check In Safe (Complete)
              </Button>
              <Button variant="ghost" size="sm" icon={XCircle} onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(246, 221, 229, 0.8)',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Destination
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                {activeJourney.destinationLabel}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Expected Arrival
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-secondary)', marginTop: '0.2rem' }}>
                {activeJourney.expectedArrivalAt || 'Not specified'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Latest GPS Fix
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                {currentLocation
                  ? `${currentLocation.latitude.toFixed(4)}°, ${currentLocation.longitude.toFixed(4)}° (±${Math.round(currentLocation.accuracy)}m)`
                  : activeJourney.lastLatitude
                  ? `${activeJourney.lastLatitude.toFixed(4)}°, ${activeJourney.lastLongitude.toFixed(4)}°`
                  : 'Acquiring coordinates...'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Sharing Audience
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                {activeJourney.selectedContactIds?.length > 0
                  ? `${activeJourney.selectedContactIds.length} Trusted Contact(s)`
                  : 'All Emergency Contacts'}
              </div>
            </div>
          </div>

          {/* Share Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Button
              variant="outline"
              size="sm"
              icon={Share2}
              onClick={handleShareWithContacts}
              disabled={shareLoading}
            >
              {shareLoading ? 'Dispatching Update...' : 'Share Progress via Email'}
            </Button>
            {shareMessage && (
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: shareMessage.type === 'success' ? '#2E7D32' : 'var(--color-emergency)'
                }}
              >
                {shareMessage.text}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Live Map Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '420px', position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12 / span 4' }}>
          <Card padding="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Travel Safeguards
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>GPS updates are automatically saved to your authenticated account.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>Send direct live location updates to contacts via Brevo transactional emails.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-secondary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>Mark safe check-in as soon as you reach your destination.</span>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(246, 221, 229, 0.8)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                Need immediate assistance during your trip?
              </div>
              <a href="/safety/sos">
                <Button variant="emergency" fullWidth size="sm">
                  Trigger Emergency SOS
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Past Journeys History */}
      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Journey History
      </h3>

      {journeys.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Navigation size={36} color="var(--color-text-light)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
            No Journeys Logged Yet
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Click "Start New Journey" to plan and track your commute with trusted contacts.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {journeys.map((j) => (
            <Card key={j.id} padding="md" hoverEffect={true}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                  {j.title}
                </h4>
                <Badge
                  variant={j.status === 'completed' ? 'primary' : j.status === 'active' ? 'secondary' : 'default'}
                >
                  {j.status}
                </Badge>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>📍 <strong>To:</strong> {j.destinationLabel}</div>
                <div>⏱️ <strong>Expected:</strong> {j.expectedArrivalAt || 'N/A'}</div>
                {j.completedAt && <div>✅ <strong>Completed:</strong> {new Date(j.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(246, 221, 229, 0.6)', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => handleDeletePast(j.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Journey Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(41, 33, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                Start a Trusted Journey
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(217, 45, 58, 0.1)', color: 'var(--color-emergency)', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleStartJourney} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Journey Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Office to Home via Metro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.9rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Destination Address / Landmark *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 221B Baker Street or Dadar Station"
                  value={destinationLabel}
                  onChange={(e) => setDestinationLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.9rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Dest. Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="19.0760"
                    value={destinationLat}
                    onChange={(e) => setDestinationLat(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Dest. Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="72.8777"
                    value={destinationLng}
                    onChange={(e) => setDestinationLng(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Expected Travel Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min="5"
                  max="720"
                  value={expectedDurationMinutes}
                  onChange={(e) => setExpectedDurationMinutes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.9rem' }}
                  required
                />
              </div>

              {emergencyContacts.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                    Select Trusted Contacts to Notify
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
                    {emergencyContacts.map((c) => (
                      <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContacts([...selectedContacts, c.id]);
                            } else {
                              setSelectedContacts(selectedContacts.filter((id) => id !== c.id));
                            }
                          }}
                        />
                        <span>{c.name} ({c.relation || 'Contact'}) — {c.email || c.phone}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Vehicle number, cab details, or meeting notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Starting...' : 'Start Live Tracking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPage;
