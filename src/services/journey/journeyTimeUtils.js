/**
 * Trusted Journey Time & Overdue Calculation Engine
 * 
 * Provides robust epoch-based calculations for:
 * - Expected arrival times across AM/PM boundaries
 * - Midnight crossovers and calendar date transitions
 * - Backward-compatible parsing of legacy Firestore journey records
 */

/**
 * Parses legacy time strings like "04:30 PM", "16:30", or ISO strings into epoch milliseconds.
 *
 * @param {object} journey - Firestore journey document data
 * @param {Date|number} [referenceDate] - Optional anchor date (defaults to journey.startedAt or current time)
 * @returns {number|null} Epoch timestamp in milliseconds, or null if unparseable
 */
export function parseJourneyArrivalTimestamp(journey, referenceDate = null) {
  if (!journey) return null;

  // 1. Direct epoch property
  if (typeof journey.expectedArrivalEpoch === 'number' && !isNaN(journey.expectedArrivalEpoch) && journey.expectedArrivalEpoch > 0) {
    return journey.expectedArrivalEpoch;
  }

  const rawArrival = journey.expectedArrivalAt;
  if (!rawArrival) return null;

  // If rawArrival is already a number
  if (typeof rawArrival === 'number' && !isNaN(rawArrival) && rawArrival > 0) {
    return rawArrival;
  }

  const arrivalStr = String(rawArrival).trim();

  // 2. Full ISO 8601 or standard date string (e.g., "2026-10-12T18:45:00.000Z")
  const parsedDirect = Date.parse(arrivalStr);
  if (!isNaN(parsedDirect) && arrivalStr.includes('T')) {
    return parsedDirect;
  }

  // 3. Fallback: Parse localized or 12h/24h time string (e.g. "04:30 PM", "4:30 pm", "16:30")
  const anchor = referenceDate
    ? new Date(referenceDate)
    : journey.startedAt
    ? new Date(journey.startedAt)
    : new Date();

  if (isNaN(anchor.getTime())) {
    return !isNaN(parsedDirect) ? parsedDirect : null;
  }

  // Match formats: "HH:MM", "HH:MM:SS", "HH:MM AM/PM", "H:MMam"
  const timeMatch = arrivalStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

    if (meridiem) {
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
    }

    const candidate = new Date(anchor.getTime());
    candidate.setHours(hours, minutes, 0, 0);

    // If candidate time is earlier than the journey start time, the arrival crossed midnight into the next day
    if (candidate.getTime() < anchor.getTime()) {
      candidate.setDate(candidate.getDate() + 1);
    }

    return candidate.getTime();
  }

  // 4. Last resort Date.parse
  return !isNaN(parsedDirect) ? parsedDirect : null;
}

/**
 * Checks whether an active journey is currently overdue.
 *
 * @param {object} journey - Journey document
 * @param {number} [currentEpoch] - Current epoch milliseconds (defaults to Date.now())
 * @returns {boolean} True if active journey has passed its expected arrival
 */
export function isJourneyOverdue(journey, currentEpoch = Date.now()) {
  if (!journey || journey.status !== 'active') return false;
  const arrivalEpoch = parseJourneyArrivalTimestamp(journey);
  if (!arrivalEpoch) return false;
  return currentEpoch > arrivalEpoch;
}

/**
 * Calculates remaining time in milliseconds until expected arrival.
 * Positive = time remaining; Negative = overdue milliseconds.
 *
 * @param {object} journey - Journey document
 * @param {number} [currentEpoch] - Current epoch milliseconds (defaults to Date.now())
 * @returns {number|null} Milliseconds remaining, or null if unknown
 */
export function getJourneyTimeRemainingMs(journey, currentEpoch = Date.now()) {
  if (!journey) return null;
  const arrivalEpoch = parseJourneyArrivalTimestamp(journey);
  if (!arrivalEpoch) return null;
  return arrivalEpoch - currentEpoch;
}

/**
 * Formats expected arrival time for display.
 * Shows localized time, and indicates "Tomorrow" if crossing midnight.
 *
 * @param {object} journey - Journey document
 * @returns {string} Human-readable arrival string
 */
export function formatExpectedArrivalDisplay(journey) {
  if (!journey) return 'Not specified';
  const arrivalEpoch = parseJourneyArrivalTimestamp(journey);
  if (!arrivalEpoch) {
    return journey.expectedArrivalLabel || journey.expectedArrivalAt || 'Not specified';
  }

  const arrivalDate = new Date(arrivalEpoch);
  const now = new Date();

  const isDifferentDay =
    arrivalDate.getFullYear() !== now.getFullYear() ||
    arrivalDate.getMonth() !== now.getMonth() ||
    arrivalDate.getDate() !== now.getDate();

  const timeString = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isDifferentDay) {
    const isTomorrow =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toDateString() ===
      new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate()).toDateString();

    return isTomorrow ? `Tomorrow, ${timeString}` : `${arrivalDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeString}`;
  }

  return timeString;
}

/**
 * Formats remaining or overdue duration into user-friendly text (e.g. "15 mins remaining", "5 mins overdue").
 *
 * @param {object} journey - Journey document
 * @param {number} [currentEpoch] - Current epoch milliseconds
 * @returns {string} Formatted duration string
 */
export function formatJourneyTimeStatus(journey, currentEpoch = Date.now()) {
  if (!journey || journey.status !== 'active') return '';
  const diffMs = getJourneyTimeRemainingMs(journey, currentEpoch);
  if (diffMs == null) return '';

  const absMinutes = Math.round(Math.abs(diffMs) / 60000);
  if (diffMs < 0) {
    return absMinutes === 0 ? 'Due right now' : `${absMinutes} min${absMinutes === 1 ? '' : 's'} overdue`;
  }
  return absMinutes === 0 ? 'Arriving now' : `${absMinutes} min${absMinutes === 1 ? '' : 's'} left`;
}
