import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Share2, Shield, AlertCircle, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';

const LocationPage = () => {
  const { currentLocation, locationError, isLocating, getCurrentPosition, startWatchingLocation } = useSafety();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY || 'BE8E5HFWGrNH05pGD0M4';

  // Request location on mount and start continuous watching
  useEffect(() => {
    getCurrentPosition();
    const stopWatching = startWatchingLocation();
    return () => {
      if (stopWatching) stopWatching();
    };
  }, [getCurrentPosition, startWatchingLocation]);

  // Initialize MapLibre Map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Prevent duplicate instantiation

    const initialLng = currentLocation?.longitude ?? 77.2090;
    const initialLat = currentLocation?.latitude ?? 28.6139;
    const initialZoom = currentLocation ? 15 : 5;

    try {
      const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center: [initialLng, initialLat],
        zoom: initialZoom,
        attributionControl: false
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
        map.resize();
      });

      map.on('error', (e) => {
        console.warn('MapLibre error event:', e);
        if (e.error && e.error.message && e.error.message.includes('403')) {
          setMapError('MapTiler key unauthorized or expired. Please check your MapTiler API key.');
        } else if (e.error) {
          setMapError('Unable to load map tiles. Please check your network connection.');
        }
      });

      mapRef.current = map;

      // Ensure proper canvas resize on container dimension change
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      // Trigger initial resize after a brief moment for layout stabilization
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 200);

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
      };
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setMapError('Failed to initialize MapLibre GL engine.');
    }
  }, [mapTilerKey]);

  // Update marker and pan to location whenever currentLocation updates
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    const { latitude, longitude } = currentLocation;

    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'custom-user-marker';
      el.style.width = '22px';
      el.style.height = '22px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#D92D3A';
      el.style.border = '3px solid #FFFFFF';
      el.style.boxShadow = '0 0 16px rgba(217, 45, 58, 0.85)';
      el.style.cursor = 'pointer';

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([longitude, latitude]);
    }

    if (mapLoaded) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        speed: 1.2,
        essential: true
      });
    }
  }, [currentLocation, mapLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const shareUrl = currentLocation
    ? `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRecenter = () => {
    getCurrentPosition();
    if (mapRef.current && currentLocation) {
      mapRef.current.flyTo({
        center: [currentLocation.longitude, currentLocation.latitude],
        zoom: 16,
        essential: true
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={MapPin}>
          Live Geolocation
        </Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Live Location & Map Guard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Real-time interactive MapTiler GPS mapping with continuous location tracking and trip link sharing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Map Container */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '520px', display: 'flex', flexDirection: 'column' }}>
            <div
              ref={mapContainerRef}
              style={{
                flex: 1,
                width: '100%',
                minHeight: '420px',
                height: '100%',
                position: 'relative',
                backgroundColor: '#EDE7EC'
              }}
            >
              {mapError && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-emergency)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <AlertCircle size={18} color="var(--color-emergency)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-emergency)', fontWeight: 600 }}>
                    {mapError}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(246, 221, 229, 0.8)' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>
                  {currentLocation
                    ? `📍 Lat: ${currentLocation.latitude.toFixed(5)}° | Lng: ${currentLocation.longitude.toFixed(5)}°`
                    : isLocating
                    ? 'Acquiring GPS coordinates...'
                    : locationError
                    ? `⚠️ ${locationError}`
                    : 'Location Standby'}
                </span>
                {currentLocation?.accuracy && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Accuracy: ±{Math.round(currentLocation.accuracy)}m • Live Tracking Active
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Navigation}
                  onClick={handleRecenter}
                  disabled={isLocating}
                >
                  {isLocating ? 'Locating...' : 'Recenter GPS'}
                </Button>
                <Button
                  variant={sharing ? 'emergency' : 'secondary'}
                  size="sm"
                  icon={Share2}
                  onClick={() => setSharing(!sharing)}
                  disabled={!currentLocation}
                >
                  {sharing ? 'Sharing Active' : 'Share Live Trip'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Share Link Drawer */}
          {sharing && currentLocation && (
            <Card padding="md" style={{ marginTop: '1rem', border: '2px solid var(--color-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Live Location Sharing Link:
                </span>
                <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 700 }}>
                  ● Active Link
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(246, 221, 229, 0.9)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                />
                <Button variant="primary" size="sm" icon={copied ? Check : Copy} onClick={handleCopyLink}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" icon={ExternalLink}>
                    Open
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {locationError && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(217, 45, 58, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-emergency)', color: 'var(--color-emergency)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>Location access is required to display your current position. Please allow location access in your browser settings.</span>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ gridColumn: 'span 12 / span 4' }}>
          <Card padding="lg" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Safety Geofencing
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)' }}>SAFE CORRIDOR</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>Home to Campus Route</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Auto-check in on safe arrival</span>
              </div>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-health)' }}>EMERGENCY RADIUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>Nearest Verified Helplines</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>112 Emergency Services active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
