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
    maxAgeMs = LOCATION_MAX_AGE_MS,
    targetAccuracy = 25 // Target accuracy in meters (<= 25m is high-accuracy satellite lock)
  } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    let resolved = false;
    let bestFix = null;
    let watchId = null;
    let timerId = null;

    const cleanup = () => {
      if (watchId !== null) {
        try {
          navigator.geolocation.clearWatch(watchId);
        } catch (_) {}
        watchId = null;
      }
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    const finish = (fix) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(fix);
    };

    const fail = (error) => {
      if (resolved) return;
      if (bestFix) {
        // If we gathered at least one fix, return the best fix rather than rejecting
        finish(bestFix);
        return;
      }
      resolved = true;
      cleanup();
      let message = 'Unable to retrieve location.';
      switch (error?.code) {
        case 1: // PERMISSION_DENIED
          message = 'Location permission was denied. Please allow location access in your browser settings.';
          break;
        case 2: // POSITION_UNAVAILABLE
          message = 'Location information is currently unavailable.';
          break;
        case 3: // TIMEOUT
          message = 'Location request timed out. Please try again.';
          break;
        default:
          message = error?.message || message;
      }
      const customErr = new Error(message);
      customErr.code = error?.code;
      reject(customErr);
    };

    // Progressive acquisition using watchPosition to allow GPS hardware lock
    try {
      const maxWait = Math.min(timeout, 6000);
      timerId = setTimeout(() => {
        if (bestFix) {
          finish(bestFix);
        } else {
          // If watchPosition didn't deliver any position yet, do a direct getCurrentPosition fallback
          navigator.geolocation.getCurrentPosition(
            (pos) => finish(formatLocationFix(pos, { maxAgeMs, source: 'gps' })),
            (err) => fail(err),
            { enableHighAccuracy, timeout: Math.max(1000, timeout - maxWait), maximumAge }
          );
        }
      }, maxWait);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const fix = formatLocationFix(position, { maxAgeMs, source: 'gps' });
          if (!bestFix || (fix.accuracy != null && (bestFix.accuracy == null || fix.accuracy < bestFix.accuracy))) {
            bestFix = fix;
          }
          // If high-accuracy satellite lock achieved, resolve immediately
          if (fix.accuracy != null && fix.accuracy <= targetAccuracy) {
            finish(fix);
          }
        },
        (err) => {
          if (err.code === 1) { // PERMISSION_DENIED
            fail(err);
          } else if (!bestFix) {
            // Attempt getCurrentPosition fallback
            navigator.geolocation.getCurrentPosition(
              (pos) => finish(formatLocationFix(pos, { maxAgeMs, source: 'gps' })),
              (fallbackErr) => fail(fallbackErr),
              { enableHighAccuracy, timeout: 5000, maximumAge }
            );
          } else {
            finish(bestFix);
          }
        },
        { enableHighAccuracy, timeout, maximumAge }
      );
    } catch (_) {
      // Direct getCurrentPosition fallback if watchPosition fails
      navigator.geolocation.getCurrentPosition(
        (pos) => finish(formatLocationFix(pos, { maxAgeMs, source: 'gps' })),
        (err) => fail(err),
        { enableHighAccuracy, timeout, maximumAge }
      );
    }
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
