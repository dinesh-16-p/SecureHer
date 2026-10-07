import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Share2, AlertCircle, Copy, Check, ExternalLink, Layers, Clock, Crosshair } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';

// ─── MapTiler style definitions ───────────────────────────────────────────────
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'BE8E5HFWGrNH05pGD0M4';

const MAP_STYLES = [
  { id: 'streets-v2',      label: '🗺 Streets',   url: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}` },
  { id: 'outdoor-v2',      label: '🏔 Outdoor',   url: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}` },
  { id: 'satellite',       label: '🛰 Satellite', url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
  { id: 'hybrid',          label: '🌐 Hybrid',    url: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}` },
  { id: 'dataviz-dark',    label: '🌑 Dark',      url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}` },
  { id: 'dataviz-light',   label: '☀ Light',     url: `https://api.maptiler.com/maps/dataviz-light/style.json?key=${MAPTILER_KEY}` },
];

// Accuracy threshold in metres — below this is considered good GPS
const GOOD_ACCURACY_THRESHOLD = 50;

const LocationPage = () => {
  const { currentLocation, locationError, isLocating, getCurrentPosition, startWatchingLocation } = useSafety();

  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markerRef       = useRef(null);
  const isCenteredRef   = useRef(false); // true once we've flown to the user's real position

  const [activeStyleId, setActiveStyleId] = useState('streets-v2');
  const [mapLoaded,     setMapLoaded]     = useState(false);
  const [mapError,      setMapError]      = useState(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [sharing,       setSharing]       = useState(false);
  const [copied,        setCopied]        = useState(false);

  // ── 1. Start location watch on mount ────────────────────────────────────────
  useEffect(() => {
    getCurrentPosition();
    const stop = startWatchingLocation();
    return () => { if (stop) stop(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Create map ONCE ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialStyle = MAP_STYLES[0].url;
    // Default to India centre until GPS arrives
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [78.9629, 20.5937],
      zoom: 4,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
      map.resize();
    });

    map.on('error', (e) => {
      if (e.error?.message?.includes('403')) {
        setMapError('MapTiler API key is invalid or expired.');
      } else if (e.error) {
        setMapError('Map tiles could not be loaded. Check your network.');
      }
    });

    mapRef.current = map;

    // ResizeObserver keeps the canvas properly sized
    const ro = new ResizeObserver(() => { map.resize(); });
    ro.observe(mapContainerRef.current);

    // Initial resize after layout settles
    const t = setTimeout(() => map.resize(), 250);

    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []); // only once

  // ── 3. Update MARKER when location changes (no flyTo on every update) ────────
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    const { latitude, longitude } = currentLocation;
    const lngLat = [longitude, latitude]; // GeoJSON order: [lng, lat]

    if (!markerRef.current) {
      // Create marker element
      const el = document.createElement('div');
      el.style.cssText = `
        width:20px; height:20px; border-radius:50%;
        background:#D92D3A; border:3px solid #fff;
        box-shadow:0 0 14px rgba(217,45,58,0.8);
      `;

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
    } else {
      // Only update position — no new marker created
      markerRef.current.setLngLat(lngLat);
    }

    // Fly to GPS position ONLY the first time we get a real fix
    if (mapLoaded && !isCenteredRef.current) {
      mapRef.current.flyTo({ center: lngLat, zoom: 15, speed: 1.4, essential: true });
      isCenteredRef.current = true;
    }
  }, [currentLocation, mapLoaded]);

  // ── 4. Style switching ────────────────────────────────────────────────────────
  const handleStyleChange = useCallback((styleId) => {
    const style = MAP_STYLES.find(s => s.id === styleId);
    if (!style || !mapRef.current) return;

    setActiveStyleId(styleId);
    setShowStyleMenu(false);

    mapRef.current.setStyle(style.url);

    // After style loads, restore the marker (setStyle removes all layers/markers)
    mapRef.current.once('style.load', () => {
      if (markerRef.current && currentLocation) {
        markerRef.current.remove();
        markerRef.current = null;

        const { latitude, longitude } = currentLocation;
        const el = document.createElement('div');
        el.style.cssText = `
          width:20px; height:20px; border-radius:50%;
          background:#D92D3A; border:3px solid #fff;
          box-shadow:0 0 14px rgba(217,45,58,0.8);
        `;
        markerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      }
    });
  }, [currentLocation]);

  // ── 5. Manual recenter ────────────────────────────────────────────────────────
  const handleRecenter = useCallback(() => {
    getCurrentPosition();
    if (mapRef.current && currentLocation) {
      mapRef.current.flyTo({
        center: [currentLocation.longitude, currentLocation.latitude],
        zoom: 16,
        essential: true,
      });
    }
  }, [getCurrentPosition, currentLocation]);

  // ── 6. Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const shareUrl = currentLocation
    ? `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const accuracyLevel = currentLocation?.accuracy
    ? currentLocation.accuracy <= GOOD_ACCURACY_THRESHOLD ? 'good' : 'poor'
    : null;

  const activeStyle = MAP_STYLES.find(s => s.id === activeStyleId);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="primary" icon={MapPin}>Live Geolocation</Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Live Location & Map Guard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Real-time GPS tracking with accurate map marker and emergency coordinate sharing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Map Column */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '520px', display: 'flex', flexDirection: 'column' }}>

            {/* Map Container */}
            <div
              ref={mapContainerRef}
              style={{ flex: 1, width: '100%', minHeight: '420px', position: 'relative', backgroundColor: '#EDE7EC' }}
            >
              {/* Style Switcher Overlay */}
              <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 10 }}>
                <button
                  onClick={() => setShowStyleMenu(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 0.85rem', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(91,33,79,0.2)',
                    fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                  }}
                >
                  <Layers size={14} /> {activeStyle?.label}
                </button>

                {showStyleMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '0.4rem',
                    background: '#fff', borderRadius: '10px', border: '1px solid rgba(91,33,79,0.15)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', minWidth: '160px'
                  }}>
                    {MAP_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleStyleChange(s.id)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                          background: activeStyleId === s.id ? 'rgba(199,91,122,0.12)' : 'transparent',
                          color: activeStyleId === s.id ? 'var(--color-secondary)' : 'var(--color-primary)',
                          border: 'none', cursor: 'pointer'
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map error overlay */}
              {mapError && (
                <div style={{
                  position: 'absolute', top: '0.75rem', left: '0.75rem', right: '0.75rem', zIndex: 10,
                  background: 'rgba(255,255,255,0.97)', padding: '0.75rem 1rem', borderRadius: '8px',
                  border: '1px solid var(--color-emergency)', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <AlertCircle size={16} color="var(--color-emergency)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-emergency)', fontWeight: 600 }}>{mapError}</span>
                </div>
              )}

              {/* No location yet overlay */}
              {!currentLocation && !mapError && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                  zIndex: 5, background: 'rgba(255,255,255,0.9)', borderRadius: '12px',
                  padding: '1rem 1.5rem', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  {isLocating
                    ? <><div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📡</div><div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>Acquiring GPS signal...</div></>
                    : locationError
                    ? <><AlertCircle size={24} color="var(--color-emergency)" /><div style={{ fontSize: '0.85rem', color: 'var(--color-emergency)', fontWeight: 600, marginTop: '0.5rem' }}>{locationError}</div></>
                    : <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Waiting for location…</div>
                  }
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div style={{ padding: '0.85rem 1.25rem', background: '#fff', borderTop: '1px solid rgba(246,221,229,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                {currentLocation ? (
                  <>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>
                      📍 {currentLocation.latitude.toFixed(6)}°N, {currentLocation.longitude.toFixed(6)}°E
                    </span>
                    <span style={{ fontSize: '0.75rem', color: accuracyLevel === 'poor' ? '#D92D3A' : '#2E7D32', fontWeight: 600 }}>
                      {accuracyLevel === 'poor' ? '⚠️' : '✓'} Accuracy: ±{Math.round(currentLocation.accuracy)}m
                      {currentLocation.timestamp && (
                        <> &nbsp;·&nbsp; <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {formatTimestamp(currentLocation.timestamp)}</>
                      )}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {isLocating ? '📡 Acquiring GPS...' : locationError ? `⚠️ ${locationError}` : 'No GPS fix yet'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" icon={Crosshair} onClick={handleRecenter} disabled={isLocating}>
                  {isLocating ? 'Locating...' : 'Recenter'}
                </Button>
                <Button variant={sharing ? 'emergency' : 'secondary'} size="sm" icon={Share2} onClick={() => setSharing(v => !v)} disabled={!currentLocation}>
                  {sharing ? 'Sharing On' : 'Share Location'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Share Link Drawer */}
          {sharing && currentLocation && (
            <Card padding="md" style={{ marginTop: '1rem', border: '2px solid var(--color-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>Google Maps Link:</span>
                <span style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 700 }}>● Live</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" readOnly value={shareUrl}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(246,221,229,0.9)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                />
                <Button variant="primary" size="sm" icon={copied ? Check : Copy} onClick={handleCopyLink}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" icon={ExternalLink}>Open</Button>
                </a>
              </div>
            </Card>
          )}

          {locationError && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(217,45,58,0.08)', borderRadius: '8px', border: '1px solid var(--color-emergency)', color: 'var(--color-emergency)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{locationError} — Please allow location access in your browser settings and refresh.</span>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ gridColumn: 'span 12 / span 4' }}>
          {/* GPS Status Card */}
          <Card padding="lg" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              GPS Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Latitude',  value: currentLocation ? `${currentLocation.latitude.toFixed(6)}°` : '—' },
                { label: 'Longitude', value: currentLocation ? `${currentLocation.longitude.toFixed(6)}°` : '—' },
                { label: 'Accuracy',  value: currentLocation?.accuracy ? `±${Math.round(currentLocation.accuracy)} m` : '—', warn: accuracyLevel === 'poor' },
                { label: 'Last Fix',  value: currentLocation?.timestamp ? formatTimestamp(currentLocation.timestamp) : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(246,221,229,0.6)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: row.warn ? '#D92D3A' : 'var(--color-primary)' }}>{row.value}</span>
                </div>
              ))}
              {accuracyLevel === 'poor' && (
                <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(217,45,58,0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#D92D3A', fontWeight: 600 }}>
                  ⚠️ Low GPS accuracy. Move to open sky for better signal.
                </div>
              )}
            </div>
          </Card>

          {/* Emergency Helplines */}
          <Card padding="lg">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>Emergency Helplines</h3>
            {[
              { label: '112 — National Emergency', href: 'tel:112' },
              { label: '1091 — Women Helpline', href: 'tel:1091' },
              { label: '100 — Police', href: 'tel:100' },
            ].map(h => (
              <a key={h.href} href={h.href} style={{ display: 'block', padding: '0.6rem 0.75rem', marginBottom: '0.5rem', background: 'rgba(217,45,58,0.07)', borderRadius: '8px', color: 'var(--color-emergency)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                📞 {h.label}
              </a>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
