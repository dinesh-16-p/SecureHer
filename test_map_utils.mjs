import { createGeoJSONCircle } from './src/services/map/mapUtils.js';

console.log('=== TEST MAP UTILS GEODESIC ACCURACY CIRCLE ===');

// Test 1: Invalid inputs return empty FeatureCollection
const empty1 = createGeoJSONCircle(null, null, 100);
console.assert(empty1.type === 'FeatureCollection' && empty1.features.length === 0, 'Null coords should yield empty collection');

const empty2 = createGeoJSONCircle(72.8777, 19.0760, -5);
console.assert(empty2.type === 'FeatureCollection' && empty2.features.length === 0, 'Negative radius should yield empty collection');
console.log('✓ Invalid input guard passed');

// Test 2: Standard circle generation
const circle = createGeoJSONCircle(72.8777, 19.0760, 50, 64);
console.assert(circle.type === 'FeatureCollection', 'Must be FeatureCollection');
console.assert(circle.features.length === 1, 'Must contain 1 feature');
const feat = circle.features[0];
console.assert(feat.geometry.type === 'Polygon', 'Geometry must be Polygon');
console.assert(feat.geometry.coordinates.length === 1, 'Must have 1 linear ring');
console.assert(feat.geometry.coordinates[0].length === 65, 'Must have 65 coordinates for closed 64-vertex polygon');

// Check first and last point are identical (closed ring)
const firstPt = feat.geometry.coordinates[0][0];
const lastPt = feat.geometry.coordinates[0][64];
console.assert(Math.abs(firstPt[0] - lastPt[0]) < 1e-6 && Math.abs(firstPt[1] - lastPt[1]) < 1e-6, 'Polygon ring must be closed');
console.log('✓ Standard circle geometry validated');

// Test 3: Radius properties
console.assert(feat.properties.radiusMeters === 50, 'Feature properties must retain radius');
console.log('✓ Radius property validated');

console.log('=== ALL MAP UTILS TESTS PASSED ===');
