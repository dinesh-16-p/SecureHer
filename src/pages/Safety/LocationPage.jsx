import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Share2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Clock,
  Crosshair,
  Search,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Move
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';
import {
  updateAccuracyCircleOnMap,
  removeAccuracyCircleFromMap,
  configureMapMissingImageResolver
} from '../../services/map/mapUtils';

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

const LocationPage = () => {
  const {
    currentLocation,
    locationError,
    isLocating,
    getCurrentPosition,
    startWatchingLocation,
    setManualLocation
  } = useSafety();

  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markerRef       = useRef(null);
  const isCenteredRef   = useRef(false);

  const [activeStyleId, setActiveStyleId] = useState('streets-v2');
  const [mapLoaded,     setMapLoaded]     = useState(false);
  const [mapError,      setMapError]      = useState(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [sharing,       setSharing]       = useState(false);
  const [copied,        setCopied]        = useState(false);

  // Search & calibration states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [tapToPinActive, setTapToPinActive] = useState(false);
  const [calibrationNotice, setCalibrationNotice] = useState(null);

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

    // Suppress missing style icon warnings & resolve on-demand with transparent pixels
    configureMapMissingImageResolver(map);

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);
      map.resize();
    });

    map.on('error', (e) => {
      if (e.error?.message?.includes('403')) {
        setMapError('MapTiler API key is invalid or expired.');
      } else if (e.error && !e.error?.message?.includes('Image')) {
        setMapError('Map tiles could not be loaded. Check your network.');
      }
    });

    mapRef.current = map;

    // ResizeObserver keeps the canvas properly sized
    const ro = new ResizeObserver(() => { map.resize(); });
    ro.observe(mapContainerRef.current);

    const t = setTimeout(() => map.resize(), 250);

    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  // ── 3. Helper to create draggable marker ─────────────────────────────────────
  const createMarkerElement = useCallback(() => {
    const el = document.createElement('div');
    el.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #D92D3A;
      border: 3px solid #FFFFFF;
      box-shadow: 0 0 16px rgba(217, 45, 58, 0.9);
      cursor: grab;
      position: relative;
    `;
    el.title = 'Drag pin to calibrate exact location';
    return el;
  }, []);

  // ── 4. Update MARKER & ACCURACY CIRCLE when location changes ────────────────
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    const { latitude, longitude, accuracy } = currentLocation;
    const lngLat = [longitude, latitude];

    if (!markerRef.current) {
      const el = createMarkerElement();
      const marker = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat(lngLat)
        .addTo(mapRef.current);

      marker.on('dragend', () => {
        const { lng, lat } = marker.getLngLat();
        setManualLocation({ latitude: lat, longitude: lng, accuracy: 5 });
        setCalibrationNotice(`Pinned: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setLngLat(lngLat);
    }

    // Render geodesic accuracy radius circle
    if (accuracy != null) {
      updateAccuracyCircleOnMap(
        mapRef.current,
        'location-accuracy-circle',
        longitude,
        latitude,
        accuracy,
        {
          fillColor: currentLocation.isCalibrated ? '#2E7D32' : '#D92D3A',
          lineColor: currentLocation.isCalibrated ? '#2E7D32' : '#D92D3A',
          fillOpacity: 0.12,
          lineOpacity: 0.5
        }
      );
    }

    // Fly to GPS position ONLY the first time we get a real fix
    if (mapLoaded && !isCenteredRef.current) {
      mapRef.current.flyTo({ center: lngLat, zoom: 15, speed: 1.4, essential: true });
      isCenteredRef.current = true;
    }
  }, [currentLocation, mapLoaded, createMarkerElement, setManualLocation]);

  // ── 5. Map Click Listener for Tap-to-Pin Calibration ────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleClick = (e) => {
      if (!tapToPinActive) return;
      const { lng, lat } = e.lngLat;
      setManualLocation({ latitude: lat, longitude: lng, accuracy: 5 });
      setCalibrationNotice(`Pinned to ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
      setTapToPinActive(false);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [tapToPinActive, setManualLocation]);

  // ── 6. Address / Landmark Geocoding Search ────────────────────────────────────
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      let results = [];

      // 1. Try MapTiler Geocoding API first
      try {
        const maptilerRes = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}&limit=5`
        );
        if (maptilerRes.ok) {
          const data = await maptilerRes.json();
          if (data.features && data.features.length > 0) {
            results = data.features.map(f => ({
              id: f.id,
              name: f.place_name,
              lng: f.center[0],
              lat: f.center[1]
            }));
          }
        }
      } catch (_) {}

      // 2. Fallback to OpenStreetMap Nominatim
      if (results.length === 0) {
        const nominatimRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        if (nominatimRes.ok) {
          const data = await nominatimRes.json();
          results = data.map(item => ({
            id: item.place_id,
            name: item.display_name,
            lng: parseFloat(item.lon),
            lat: parseFloat(item.lat)
          }));
        }
      }

      if (results.length === 0) {
        setSearchError('No places found. Try typing a nearby street, hospital, or city area.');
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setSearchError('Search request failed. You can tap directly on the map to place your pin.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setSearchResults([]);
    setSearchQuery(loc.name);
    setManualLocation({ latitude: loc.lat, longitude: loc.lng, accuracy: 5, address: loc.name });
    setCalibrationNotice(`Pinned: ${loc.name}`);
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [loc.lng, loc.lat], zoom: 16, speed: 1.4, essential: true });
    }
  };

  // ── 7. Reset to Live Hardware GPS ──────────────────────────────────────────
  const handleResetToGps = () => {
    setCalibrationNotice(null);
    setSearchQuery('');
    setManualLocation(null);
    getCurrentPosition({ forceFresh: true });
  };

  // ── 8. Style switching ────────────────────────────────────────────────────────
  const handleStyleChange = useCallback((styleId) => {
    const style = MAP_STYLES.find(s => s.id === styleId);
    if (!style || !mapRef.current) return;

    setActiveStyleId(styleId);
    setShowStyleMenu(false);

    mapRef.current.setStyle(style.url);

    mapRef.current.once('style.load', () => {
      configureMapMissingImageResolver(mapRef.current);

      if (markerRef.current && currentLocation) {
        markerRef.current.remove();
        markerRef.current = null;

        const { latitude, longitude, accuracy } = currentLocation;
        const el = createMarkerElement();
        const marker = new maplibregl.Marker({ element: el, draggable: true })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        marker.on('dragend', () => {
          const { lng, lat } = marker.getLngLat();
          setManualLocation({ latitude: lat, longitude: lng, accuracy: 5 });
          setCalibrationNotice(`Pinned: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
        });

        markerRef.current = marker;

        if (accuracy != null) {
          updateAccuracyCircleOnMap(
            mapRef.current,
            'location-accuracy-circle',
            longitude,
            latitude,
            accuracy,
            {
              fillColor: currentLocation.isCalibrated ? '#2E7D32' : '#D92D3A',
              lineColor: currentLocation.isCalibrated ? '#2E7D32' : '#D92D3A',
              fillOpacity: 0.12,
              lineOpacity: 0.5
            }
          );
        }
      }
    });
  }, [currentLocation, createMarkerElement, setManualLocation]);

  // ── 9. Manual recenter ────────────────────────────────────────────────────────
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

  // ── 10. Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        removeAccuracyCircleFromMap(mapRef.current, 'location-accuracy-circle');
      }
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

  const accuracyLevel = currentLocation?.accuracyCategory || (
    currentLocation?.accuracy != null
      ? (currentLocation.accuracy <= 20 ? 'high' : currentLocation.accuracy <= 100 ? 'moderate' : 'poor')
      : null
  );

  const isStaleFix = currentLocation ? (currentLocation.isStale || (currentLocation.ageMs > 120000)) : false;
  const isApproximate = currentLocation && (currentLocation.accuracy > 50 || accuracyLevel === 'poor') && !currentLocation.isCalibrated;
  const activeStyle = MAP_STYLES.find(s => s.id === activeStyleId);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="primary" icon={MapPin}>Live Geolocation</Badge>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
          Live Location & Map Guard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
          Precision GPS tracking, draggable pin calibration, and emergency coordinate sharing.
        </p>
      </div>

      {/* Accuracy Calibration Banner (when device reports coarse Wi-Fi/IP location) */}
      {isApproximate && (
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.9rem 1.25rem',
          background: 'rgba(217, 45, 58, 0.08)',
          borderRadius: '10px',
          border: '1px solid rgba(217, 45, 58, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} color="var(--color-emergency)" />
            <span style={{ fontSize: '0.88rem', color: 'var(--color-emergency)', fontWeight: 600 }}>
              Device location is approximate (±{Math.round(currentLocation.accuracy)}m). Desktop/laptop browsers use Wi-Fi or ISP IP estimates.
              Drag the red pin or search your address to pinpoint your exact spot.
            </span>
          </div>
          <Button
            size="sm"
            variant="emergency"
            icon={Move}
            onClick={() => setTapToPinActive(true)}
          >
            {tapToPinActive ? 'Click on map now' : 'Tap Map to Pin Exact Spot'}
          </Button>
        </div>
      )}

      {/* Active Calibration Confirmation Notice */}
      {calibrationNotice && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(46, 125, 50, 0.1)',
          borderRadius: '8px',
          border: '1px solid #2E7D32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#2E7D32" />
            <span style={{ fontSize: '0.85rem', color: '#2E7D32', fontWeight: 700 }}>
              Location Calibrated: {calibrationNotice}
            </span>
          </div>
          <button
            onClick={handleResetToGps}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            Reset to Device GPS
          </button>
        </div>
      )}

      {/* Address & Landmark Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address, street name, hospital, or landmark to calibrate pin..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(91, 33, 79, 0.2)',
                background: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={isSearching ? Loader2 : Search}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Find & Pin'}
          </Button>
          {currentLocation?.isCalibrated && (
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={RefreshCw}
              onClick={handleResetToGps}
              title="Reset to device GPS"
            >
              Reset GPS
            </Button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 30,
            marginTop: '0.25rem',
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid rgba(91, 33, 79, 0.2)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxHeight: '240px',
            overflowY: 'auto'
          }}>
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectLocation(item)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(199, 91, 122, 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                📍 <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 30,
            marginTop: '0.25rem',
            background: '#FFFFFF',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--color-emergency)',
            color: 'var(--color-emergency)',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {searchError}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Map Column */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '540px', display: 'flex', flexDirection: 'column' }}>

            {/* Map Container */}
            <div
              ref={mapContainerRef}
              style={{
                flex: 1,
                width: '100%',
                minHeight: '440px',
                position: 'relative',
                backgroundColor: '#EDE7EC',
                cursor: tapToPinActive ? 'crosshair' : 'default'
              }}
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

              {/* Tap to Pin Banner overlay */}
              {tapToPinActive && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 15,
                  background: 'rgba(217,45,58,0.95)',
                  color: '#FFFFFF',
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Crosshair size={16} /> Tap anywhere on map to set your pin
                  <button
                    onClick={() => setTapToPinActive(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#FFF',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginLeft: '0.5rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

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
                    ? <><div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📡</div><div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>Acquiring high-accuracy GPS...</div></>
                    : locationError
                    ? <><AlertCircle size={24} color="var(--color-emergency)" /><div style={{ fontSize: '0.85rem', color: 'var(--color-emergency)', fontWeight: 600, marginTop: '0.5rem' }}>{locationError}</div></>
                    : <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Waiting for location…</div>
                  }
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div style={{
              padding: '0.85rem 1.25rem',
              background: '#fff',
              borderTop: '1px solid rgba(246,221,229,0.8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                {currentLocation ? (
                  <>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>
                      📍 {currentLocation.latitude.toFixed(6)}°N, {currentLocation.longitude.toFixed(6)}°E
                      {currentLocation.isCalibrated && (
                        <span style={{
                          marginLeft: '0.5rem',
                          background: 'rgba(46,125,50,0.12)',
                          color: '#2E7D32',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          Calibrated (Exact)
                        </span>
                      )}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: isStaleFix ? '#D92D3A' : accuracyLevel === 'high' ? '#2E7D32' : accuracyLevel === 'moderate' ? '#B26A00' : '#D92D3A',
                      fontWeight: 700
                    }}>
                      {currentLocation.isCalibrated
                        ? '✓ Exact Calibrated Coordinates'
                        : isStaleFix
                        ? '⚠️ Stale Fix: '
                        : accuracyLevel === 'high'
                        ? '✓ High Accuracy GPS: '
                        : accuracyLevel === 'moderate'
                        ? '⚡ Moderate Accuracy: '
                        : '⚠️ Approximate Location: '}
                      {!currentLocation.isCalibrated && `±${Math.round(currentLocation.accuracy)}m`}
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
                <Button
                  variant={tapToPinActive ? 'emergency' : 'outline'}
                  size="sm"
                  icon={Crosshair}
                  onClick={() => setTapToPinActive(v => !v)}
                  title="Click anywhere on the map to place pin"
                >
                  {tapToPinActive ? 'Click on map' : 'Tap to Calibrate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Navigation}
                  onClick={handleRecenter}
                  disabled={isLocating}
                >
                  {isLocating ? 'Locating...' : 'Recenter'}
                </Button>
                <Button
                  variant={sharing ? 'emergency' : 'secondary'}
                  size="sm"
                  icon={Share2}
                  onClick={() => setSharing(v => !v)}
                  disabled={!currentLocation}
                >
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
                <span style={{ fontSize: '0.75rem', color: isStaleFix ? '#D92D3A' : '#2E7D32', fontWeight: 700 }}>
                  {currentLocation.isCalibrated ? '● Calibrated Exact' : isStaleFix ? '● Stale (Last-Known)' : '● Live'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(246,221,229,0.9)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)'
                  }}
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
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(217,45,58,0.08)',
              borderRadius: '8px',
              border: '1px solid var(--color-emergency)',
              color: 'var(--color-emergency)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{locationError} — Please allow location access in your browser settings or calibrate your position manually using the search bar above.</span>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={{ gridColumn: 'span 12 / span 4' }}>
          {/* GPS Status Card */}
          <Card padding="lg" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              GPS & Location Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Latitude',  value: currentLocation ? `${currentLocation.latitude.toFixed(6)}°` : '—' },
                { label: 'Longitude', value: currentLocation ? `${currentLocation.longitude.toFixed(6)}°` : '—' },
                {
                  label: 'Accuracy',
                  value: currentLocation?.isCalibrated
                    ? 'Exact (Manually Calibrated)'
                    : currentLocation?.accuracy
                    ? `±${Math.round(currentLocation.accuracy)} m (${accuracyLevel ? accuracyLevel.toUpperCase() : 'UNKNOWN'})`
                    : '—',
                  warn: accuracyLevel === 'poor' && !currentLocation?.isCalibrated
                },
                {
                  label: 'Source',
                  value: currentLocation?.isCalibrated
                    ? 'Custom Pin / Calibrated'
                    : currentLocation?.source === 'gps'
                    ? 'Hardware GNSS / Satellite'
                    : currentLocation?.source || 'Device Sensor',
                  warn: false
                },
                {
                  label: 'Freshness',
                  value: currentLocation
                    ? (currentLocation.isCalibrated ? 'Calibrated & Locked' : isStaleFix ? 'Stale (Last-Known)' : 'Live / Fresh')
                    : '—',
                  warn: isStaleFix && !currentLocation?.isCalibrated
                },
                { label: 'Last Fix',  value: currentLocation?.timestamp ? formatTimestamp(currentLocation.timestamp) : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(246,221,229,0.6)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: row.warn ? '#D92D3A' : 'var(--color-primary)' }}>{row.value}</span>
                </div>
              ))}

              {currentLocation?.isCalibrated && (
                <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(46,125,50,0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#2E7D32', fontWeight: 600 }}>
                  ✓ Exact location is calibrated. All emergency alerts, SOS dispatches, and nearby service lookups will use these coordinates.
                </div>
              )}

              {accuracyLevel === 'poor' && !isStaleFix && !currentLocation?.isCalibrated && (
                <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(217,45,58,0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#D92D3A', fontWeight: 600 }}>
                  ⚠️ Low GPS accuracy (&gt; 100m). Laptop/PC browsers approximate location via Wi-Fi/IP. Drag the red pin on the map or search your address to calibrate.
                </div>
              )}

              {isStaleFix && !currentLocation?.isCalibrated && (
                <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(217,45,58,0.08)', borderRadius: '6px', fontSize: '0.8rem', color: '#D92D3A', fontWeight: 600 }}>
                  ⚠️ Location fix is stale (&gt; 120s old). Tap Recenter to obtain a fresh GPS fix.
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
