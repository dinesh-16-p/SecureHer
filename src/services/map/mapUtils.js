/**
 * Map Utility Helpers for MapLibre GL
 * Provides geodesic accuracy circles and map layer helpers
 */

/**
 * Creates a GeoJSON Polygon representing a circular geographic boundary on Earth.
 * Uses geodesic destination point equations to prevent distortion at varying latitudes.
 *
 * @param {number} lng - Longitude in degrees
 * @param {number} lat - Latitude in degrees
 * @param {number} radiusMeters - Accuracy radius in meters
 * @param {number} points - Number of vertices for smooth polygon (default 64)
 * @returns {object} GeoJSON FeatureCollection
 */
export function createGeoJSONCircle(lng, lat, radiusMeters, points = 64) {
  if (
    lat == null ||
    lng == null ||
    radiusMeters == null ||
    isNaN(lat) ||
    isNaN(lng) ||
    isNaN(radiusMeters) ||
    radiusMeters <= 0
  ) {
    return {
      type: 'FeatureCollection',
      features: []
    };
  }

  const coords = [];
  const km = Math.max(radiusMeters, 1) / 1000;
  const distanceRadians = km / 6371; // Earth mean radius in km
  const centerLatRadians = (lat * Math.PI) / 180;
  const centerLngRadians = (lng * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const ptLatRadians = Math.asin(
      Math.sin(centerLatRadians) * Math.cos(distanceRadians) +
      Math.cos(centerLatRadians) * Math.sin(distanceRadians) * Math.cos(bearing)
    );
    const ptLngRadians = centerLngRadians + Math.atan2(
      Math.sin(bearing) * Math.sin(distanceRadians) * Math.cos(centerLatRadians),
      Math.cos(distanceRadians) - Math.sin(centerLatRadians) * Math.sin(ptLatRadians)
    );

    coords.push([
      (ptLngRadians * 180) / Math.PI,
      (ptLatRadians * 180) / Math.PI
    ]);
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords]
        },
        properties: {
          radiusMeters
        }
      }
    ]
  };
}

/**
 * Updates or creates an accuracy radius polygon on a MapLibre map instance.
 *
 * @param {object} map - MapLibre GL map instance
 * @param {string} sourceId - Unique identifier for the GeoJSON source
 * @param {number} lng - User longitude
 * @param {number} lat - User latitude
 * @param {number} accuracyMeters - Accuracy reported by Geolocation API in meters
 * @param {object} styleOptions - Optional colors and opacity
 */
export function updateAccuracyCircleOnMap(map, sourceId, lng, lat, accuracyMeters, styleOptions = {}) {
  if (!map) return;

  const circleData = createGeoJSONCircle(lng, lat, accuracyMeters);
  const fillLayerId = `${sourceId}-fill`;
  const lineLayerId = `${sourceId}-line`;

  const existingSource = map.getSource(sourceId);
  if (existingSource) {
    existingSource.setData(circleData);
  } else {
    // Only add source & layers if style is loaded
    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) {
      map.once('style.load', () => {
        updateAccuracyCircleOnMap(map, sourceId, lng, lat, accuracyMeters, styleOptions);
      });
      return;
    }

    try {
      map.addSource(sourceId, {
        type: 'geojson',
        data: circleData
      });

      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': styleOptions.fillColor || '#5B214F',
            'fill-opacity': styleOptions.fillOpacity ?? 0.12
          }
        });
      }

      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': styleOptions.lineColor || '#5B214F',
            'line-width': styleOptions.lineWidth ?? 1.5,
            'line-opacity': styleOptions.lineOpacity ?? 0.45
          }
        });
      }
    } catch (err) {
      console.warn('MapLibre accuracy layer note:', err.message);
    }
  }
}

/**
 * Cleans up the accuracy circle source and layers from a MapLibre map.
 *
 * @param {object} map - MapLibre GL map instance
 * @param {string} sourceId - Unique identifier for the GeoJSON source
 */
export function removeAccuracyCircleFromMap(map, sourceId) {
  if (!map) return;
  const fillLayerId = `${sourceId}-fill`;
  const lineLayerId = `${sourceId}-line`;

  try {
    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  } catch (err) {
    console.warn('Error removing map source/layers:', err.message);
  }
}
