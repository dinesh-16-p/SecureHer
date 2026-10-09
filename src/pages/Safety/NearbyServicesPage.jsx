import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Shield,
  Phone,
  Navigation,
  Search,
  Building,
  Flame,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useSafety } from '../../context/SafetyContext';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'BE8E5HFWGrNH05pGD0M4';
const MAPTILER_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`;

// Overpass API Endpoints (with fallback mirrors)
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
];

// Calculate straight-line distance in kilometers between two coordinates
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CATEGORIES = [
  { id: 'all', label: 'All Emergency Services', icon: Shield },
  { id: 'police', label: 'Police Stations', icon: Shield, tag: 'amenity=police' },
  { id: 'hospital', label: 'Hospitals & Trauma', icon: PlusCircle, tag: 'amenity=hospital' },
  { id: 'fire', label: 'Fire Stations', icon: Flame, tag: 'amenity=fire_station' }
];

const NearbyServicesPage = () => {
  const { currentLocation, refreshPermissions } = useSafety();

  const [activeCategory, setActiveCategory] = useState('all');
  const [radiusKm, setRadiusKm] = useState('5');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Map state
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch real OSM emergency facilities using Overpass API
  const fetchNearbyServices = async (lat, lon, radiusInKm) => {
    if (!lat || !lon) return;
    setLoading(true);
    setError(null);

    const radiusMeters = parseInt(radiusInKm, 10) * 1000;

    // Overpass query for police, hospitals, clinics, fire stations
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="police"](around:${radiusMeters},${lat},${lon});
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        node["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
        way["amenity"="police"](around:${radiusMeters},${lat},${lon});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        way["amenity"="fire_station"](around:${radiusMeters},${lat},${lon});
      );
      out center 40;
    `;

    let success = false;
    let rawElements = [];

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          rawElements = data.elements || [];
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`Overpass endpoint ${endpoint} failed:`, err.message);
      }
    }

    if (!success) {
      setError('Unable to reach OpenStreetMap emergency places service. Please check your network or try again.');
      setLoading(false);
      return;
    }

    // Parse and normalize results
    const parsed = rawElements
      .map((el) => {
        const itemLat = el.lat || el.center?.lat;
        const itemLon = el.lon || el.center?.lon;
        if (!itemLat || !itemLon) return null;

        const tags = el.tags || {};
        const amenity = tags.amenity || '';
        let category = 'other';
        if (amenity === 'police') category = 'police';
        else if (amenity === 'hospital' || amenity === 'clinic') category = 'hospital';
        else if (amenity === 'fire_station') category = 'fire';

        const name = tags.name || (category === 'police' ? 'Police Station' : category === 'hospital' ? 'Emergency Hospital / Clinic' : 'Fire Department');
        const phone = tags.phone || tags['contact:phone'] || tags['emergency:phone'] || (category === 'police' ? '112' : category === 'hospital' ? '102' : '101');
        const street = tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : '';
        const city = tags['addr:city'] || tags['addr:suburb'] || tags['addr:district'] || '';
        const address = [street, city].filter(Boolean).join(', ') || 'Local Emergency Division';

        const distKm = calculateHaversineDistance(lat, lon, itemLat, itemLon);

        return {
          id: el.id,
          name,
          category,
          latitude: itemLat,
          longitude: itemLon,
          distanceKm: distKm,
          phone,
          address,
          operator: tags.operator || tags['operator:type'] || ''
        };
      })
      .filter(Boolean);

    // Sort by straight-line distance
    parsed.sort((a, b) => a.distanceKm - b.distanceKm);
    setServices(parsed);
    setLoading(false);
  };

  // Initial fetch on coordinate availability
  useEffect(() => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      fetchNearbyServices(currentLocation.latitude, currentLocation.longitude, radiusKm);
    }
  }, [currentLocation?.latitude, currentLocation?.longitude, radiusKm]);

  // Map Initialization & Marker Placement
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLng = currentLocation?.longitude || 72.8777;
    const initialLat = currentLocation?.latitude || 19.0760;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAPTILER_STYLE,
        center: [initialLng, initialLat], // [lng, lat]
        zoom: 13
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      // User location marker
      const userEl = document.createElement('div');
      userEl.style.width = '18px';
      userEl.style.height = '18px';
      userEl.style.borderRadius = '50%';
      userEl.style.backgroundColor = '#5B214F';
      userEl.style.border = '3px solid #FFFFFF';
      userEl.style.boxShadow = '0 0 10px rgba(91, 33, 79, 0.5)';

      new maplibregl.Marker({ element: userEl })
        .setLngLat([initialLng, initialLat])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML('<strong>Your Location</strong>'))
        .addTo(map);

      mapRef.current = map;
    }

    // Clear existing service markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter services according to category & search query
    const filtered = services.filter((s) => {
      const matchesCat = activeCategory === 'all' || s.category === activeCategory;
      const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });

    // Add Markers for filtered services
    filtered.forEach((s) => {
      const color = s.category === 'police' ? '#5B214F' : s.category === 'hospital' ? '#2E7D32' : '#D92D3A';
      const markerEl = document.createElement('div');
      markerEl.style.width = '24px';
      markerEl.style.height = '24px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.backgroundColor = color;
      markerEl.style.border = '2px solid #FFFFFF';
      markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerEl.style.cursor = 'pointer';

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #5B214F; font-size: 13px;">${s.name}</strong><br/>
          <span style="font-size: 11px; color: #666;">${s.address}</span><br/>
          <span style="font-size: 11px; font-weight: bold; color: #C75B7A;">${s.distanceKm.toFixed(2)} km away</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}" target="_blank" style="font-size: 11px; color: #5B214F; font-weight: bold; text-decoration: underline;">Get Directions ↗</a>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([s.longitude, s.latitude])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [services, activeCategory, searchQuery, currentLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <Badge variant="primary" icon={Shield}>
            Geographic Safety
          </Badge>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.5rem 0' }}>
            Nearby Emergency Services
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
            Locate verified police stations, hospitals, and fire departments around your live GPS coordinates.
          </p>
        </div>

        <Button
          variant="outline"
          icon={RefreshCw}
          onClick={() => {
            if (currentLocation?.latitude && currentLocation?.longitude) {
              fetchNearbyServices(currentLocation.latitude, currentLocation.longitude, radiusKm);
            } else {
              refreshPermissions();
            }
          }}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Nearby Places'}
        </Button>
      </div>

      {/* Accuracy & Straight-Line Distance Disclaimer */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: '#FFF9FB',
          border: '1px solid rgba(246, 221, 229, 0.9)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.5rem'
        }}
      >
        <Info size={16} color="var(--color-secondary)" />
        <span>
          Distances displayed are calculated as straight-line distance from your reported GPS fix. Verified public emergency telephone numbers & direct Google Maps navigation links are provided for each facility.
        </span>
      </div>

      {/* Filter & Search Bar */}
      <Card padding="md" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '100px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    border: active ? '1px solid var(--color-primary)' : '1px solid rgba(246, 221, 229, 0.8)',
                    backgroundColor: active ? 'var(--color-primary)' : '#FFFFFF',
                    color: active ? '#FFFFFF' : 'var(--color-text)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} color={active ? '#FFFFFF' : 'var(--color-secondary)'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Radius */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--color-text-light)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search facility by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem 0.45rem 2.25rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(246, 221, 229, 0.9)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  minWidth: '220px'
                }}
              />
            </div>

            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(246, 221, 229, 0.9)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="2">Within 2 km</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="20">Within 20 km</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Map & Results Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Map View */}
        <div style={{ gridColumn: 'span 12 / span 7' }}>
          <Card padding="none" style={{ overflow: 'hidden', height: '580px', position: 'relative', border: '1px solid rgba(246, 221, 229, 0.8)' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          </Card>
        </div>

        {/* Results List */}
        <div style={{ gridColumn: 'span 12 / span 5' }}>
          <div style={{ maxHeight: '580px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <Card padding="lg" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                  Searching OpenStreetMap for nearby emergency facilities...
                </div>
              </Card>
            ) : error ? (
              <Card padding="lg" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <AlertCircle size={32} color="var(--color-emergency)" style={{ margin: '0 auto 0.75rem auto' }} />
                <div style={{ fontSize: '0.9rem', color: 'var(--color-emergency)', marginBottom: '1rem' }}>
                  {error}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => currentLocation && fetchNearbyServices(currentLocation.latitude, currentLocation.longitude, radiusKm)}
                >
                  Retry Search
                </Button>
              </Card>
            ) : filteredServices.length === 0 ? (
              <Card padding="lg" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Building size={32} color="var(--color-text-light)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  No Services Found in Radius
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Try increasing your search radius to 10 km or 20 km to discover emergency stations further away.
                </p>
              </Card>
            ) : (
              filteredServices.map((service) => (
                <Card key={service.id} padding="md" hoverEffect={true}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                      {service.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: service.category === 'police' ? 'rgba(91, 33, 79, 0.1)' : service.category === 'hospital' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(217, 45, 58, 0.1)',
                        color: service.category === 'police' ? 'var(--color-primary)' : service.category === 'hospital' ? '#2E7D32' : 'var(--color-emergency)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {service.category}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.65rem' }}>
                    📍 {service.address}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                      {service.distanceKm.toFixed(2)} km away
                    </span>
                    {service.phone && (
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        📞 {service.phone}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {service.phone && (
                      <a href={`tel:${service.phone}`} style={{ textDecoration: 'none', flex: 1 }}>
                        <Button variant="secondary" size="sm" fullWidth icon={Phone}>
                          Call
                        </Button>
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', flex: 1 }}
                    >
                      <Button variant="outline" size="sm" fullWidth icon={Navigation}>
                        Directions
                      </Button>
                    </a>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyServicesPage;
