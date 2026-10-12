/**
 * Permission Service
 * Unified, browser-compliant permission checking and requesting
 * Covers: Geolocation, Camera, Microphone, Notifications
 */

export const getPermissionStatus = async (name) => {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unsupported';
  }
  try {
    const permission = await navigator.permissions.query({ name });
    return permission.state; // 'granted' | 'denied' | 'prompt'
  } catch (err) {
    // Some browsers do not support certain permission names in query()
    return 'prompt';
  }
};

export const LOCATION_MAX_AGE_MS = 120000; // 120 seconds maximum location age for safety-sensitive operations

export const ACCURACY_THRESHOLDS = {
  HIGH: 20,      // <= 20 meters: High accuracy (GPS satellite lock)
  MODERATE: 100  // <= 100 meters: Moderate accuracy (Wi-Fi / Cell triangulation)
  // > 100 meters: Poor accuracy (Coarse cell tower / IP geolocation)
};

/**
 * Categorize GPS accuracy into High, Moderate, or Poor.
 * High: <= 20m, Moderate: 21-100m, Poor: > 100m
 */
export const getAccuracyCategory = (accuracyMeters) => {
  if (accuracyMeters == null || isNaN(accuracyMeters)) return 'unknown';
  if (accuracyMeters <= ACCURACY_THRESHOLDS.HIGH) return 'high';
  if (accuracyMeters <= ACCURACY_THRESHOLDS.MODERATE) return 'moderate';
  return 'poor';
};

/**
 * Check if a location fix is fresh based on its timestamp.
 */
export const isLocationFresh = (locationOrTimestamp, maxAgeMs = LOCATION_MAX_AGE_MS) => {
  if (!locationOrTimestamp) return false;
  const ts = typeof locationOrTimestamp === 'number'
    ? locationOrTimestamp
    : locationOrTimestamp.timestamp;
  if (!ts) return false;
  const age = Date.now() - ts;
  return age >= 0 && age <= maxAgeMs;
};

/**
 * Normalizes and annotates a raw GeolocationPosition with quality metadata.
 */
export const formatLocationFix = (position, customOptions = {}) => {
  const coords = position.coords || {};
  const timestamp = position.timestamp || Date.now();
  const accuracy = typeof coords.accuracy === 'number' ? Math.round(coords.accuracy * 10) / 10 : null;
  const ageMs = Math.max(0, Date.now() - timestamp);
  const maxAge = customOptions.maxAgeMs || LOCATION_MAX_AGE_MS;
  const isFresh = ageMs <= maxAge;

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy,
    accuracyCategory: getAccuracyCategory(accuracy),
    heading: coords.heading ?? null,
    speed: coords.speed ?? null,
    altitude: coords.altitude ?? null,
    timestamp,
    ageMs,
    isFresh,
    isStale: !isFresh,
    source: customOptions.source || 'gps'
  };
};

export const requestLocationAccess = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 12000,
    maximumAge = 0, // Default to 0 to prefer a fresh hardware fix for safety operations
    maxAgeMs = LOCATION_MAX_AGE_MS
  } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const fix = formatLocationFix(position, { maxAgeMs, source: 'gps' });
        resolve(fix);
      },
      (error) => {
        let message = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission was denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = error.message || message;
        }
        const customErr = new Error(message);
        customErr.code = error.code;
        reject(customErr);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  });
};

export const watchLocationAccess = (onSuccess, onError, options = {}) => {
  if (!navigator.geolocation) {
    if (onError) onError(new Error('Geolocation is not supported.'));
    return null;
  }

  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 5000,
    maxAgeMs = LOCATION_MAX_AGE_MS
  } = options;

  return navigator.geolocation.watchPosition(
    (position) => {
      const fix = formatLocationFix(position, { maxAgeMs, source: 'watch' });
      if (onSuccess) onSuccess(fix);
    },
    (error) => {
      if (onError) onError(error);
    },
    {
      enableHighAccuracy,
      timeout,
      maximumAge
    }
  );
};

export const clearLocationWatch = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

export const requestCameraStream = async (videoConstraints = true) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera access is not supported by your browser.');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: false
    });
    return stream;
  } catch (error) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Camera permission denied. Please allow camera access in browser settings.');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('No camera hardware found on this device.');
    }
    throw error;
  }
};

export const requestMicrophoneStream = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Microphone access is not supported by your browser.');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    return stream;
  } catch (error) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Microphone permission denied.');
    }
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    return 'denied';
  }
};

export const checkAllPermissions = async () => {
  const [geoState, cameraState, micState, notifState] = await Promise.all([
    getPermissionStatus('geolocation'),
    getPermissionStatus('camera'),
    getPermissionStatus('microphone'),
    ('Notification' in window) ? Notification.permission : 'unsupported'
  ]);

  return {
    location: geoState,
    camera: cameraState,
    microphone: micState,
    notifications: notifState
  };
};
