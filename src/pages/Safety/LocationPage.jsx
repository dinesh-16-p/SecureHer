import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Share2, Shield, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
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

  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY || 'BE8E5HFWGrNH05pGD0M4';

  // Request location on mount and start watching
  useEffect(() => {
    getCurrentPosition();
    const stopWatching = startWatchingLocation();
    return () => {
      if (stopWatching) stopWatching();
    };
  }, [getCurrentPosition, startWatchingLocation]);

  // Initialize and update MapLibre Map with MapTiler Style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fallback coordinates if location not yet granted (e.g. New Delhi center)
    const initialLng = currentLocation?.longitude ?? 77.2090;
    const initialLat = currentLocation?.latitude ?? 28.6139;
    const initialZoom = currentLocation ? 14 : 4;

    if (!mapRef.current) {
      const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center: [initialLng, initialLat],
        zoom: initialZoom,
        attributionControl: false
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
      mapRef.current = map;
    }

    // Add or update live marker
    if (currentLocation && mapRef.current) {
      const { latitude, longitude } = currentLocation;

      if (!markerRef.current) {
        // Create custom HTML pulsing marker
        const el = document.createElement('div');
        el.className = 'custom-user-marker';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#D92D3A';
        el.style.border = '3px solid #FFFFFF';
        el.style.boxShadow = '0 0 16px rgba(217, 45, 58, 0.8)';

        markerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        essential: true
      });
    }

    return () => {
      // Map cleanup on unmount
    };
  }, [currentLocation, mapTilerKey]);

  // Clean up map instance on page exit
  useEffect(() => {
    return () => {
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
          High-accuracy MapTiler satellite & vector mapping with real-time GPS coordinates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Map Container */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '480px', display: 'flex', flexDirection: 'column' }}>
            <div
              ref={mapContainerRef}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            />

            {/* Bottom Status Bar */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(246, 221, 229, 0.8)' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>
                  {currentLocation
                    ? `📍 Lat: ${currentLocation.latitude.toFixed(5)}° | Lng: ${currentLocation.longitude.toFixed(5)}°`
                    : locationError
                    ? `⚠️ ${locationError}`
                    : 'Querying GPS...'}
                </span>
                {currentLocation?.accuracy && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Accuracy: ±{Math.round(currentLocation.accuracy)}m
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Navigation}
                  onClick={() => getCurrentPosition()}
                >
                  Recenter
                </Button>
                <Button
                  variant={sharing ? 'emergency' : 'secondary'}
                  size="sm"
                  icon={Share2}
                  onClick={() => setSharing(!sharing)}
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
                  ● Active
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
              <span>Location permission required. Please enable location permissions in your browser to view your live position on the map.</span>
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
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Police & Women Booths loaded</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
