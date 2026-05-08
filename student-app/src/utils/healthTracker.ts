// ─── HEALTH TRACKER UTILITY ──────────────────────────────────────────────────
// Manages passive step counting, sleep detection, and water intake tracking
// using localStorage for persistence across sessions.

const STORAGE_KEYS = {
  STEPS_TODAY: 'health_steps_today',
  STEPS_DATE: 'health_steps_date',
  LAST_ACTIVE: 'health_last_active',
  SLEEP_STATUS: 'health_sleep_status',
  SLEEP_DATE: 'health_sleep_date',
  SLEEP_WINDOW: 'health_sleep_window',
  WATER_TODAY: 'health_water_today',
  WATER_DATE: 'health_water_date',
  WATER_LAST_ACK: 'health_water_last_ack',
};

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

/** Get today's date string in IST (YYYY-MM-DD) */
function getTodayIST() {
  const now = new Date();
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
  return istDate.toISOString().split('T')[0];
}

/** Get current hour in IST (0-23) */
function getCurrentHourIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
  return istDate.getHours();
}

/** Reset daily counters if the date has changed */
function resetIfNewDay() {
  const today = getTodayIST();
  if (localStorage.getItem(STORAGE_KEYS.STEPS_DATE) !== today) {
    localStorage.setItem(STORAGE_KEYS.STEPS_TODAY, '0');
    localStorage.setItem(STORAGE_KEYS.STEPS_DATE, today);
  }
  if (localStorage.getItem(STORAGE_KEYS.WATER_DATE) !== today) {
    localStorage.setItem(STORAGE_KEYS.WATER_TODAY, '0');
    localStorage.setItem(STORAGE_KEYS.WATER_DATE, today);
  }
}

// ─── STEP COUNTER (Accelerometer-based) ──────────────────────────────────────

let stepCount = 0;
let stepListenerActive = false;
let stepCallback: ((count: number) => void) | null = null;

// Simple step detection: look for acceleration spikes above a threshold
let lastMagnitude = 0;
let lastStepTime = 0;
const STEP_THRESHOLD = 1.2; // g-force spike threshold
const STEP_COOLDOWN = 300;  // ms between steps

function handleMotion(event) {
  const { x, y, z } = event.accelerationIncludingGravity || {};
  if (x == null || y == null || z == null) return;

  const magnitude = Math.sqrt(x * x + y * y + z * z) / 9.81; // normalize to g
  const delta = Math.abs(magnitude - lastMagnitude);
  const now = Date.now();

  if (delta > STEP_THRESHOLD && (now - lastStepTime) > STEP_COOLDOWN) {
    lastStepTime = now;
    stepCount++;
    localStorage.setItem(STORAGE_KEYS.STEPS_TODAY, String(stepCount));
    if (stepCallback) stepCallback(stepCount);
  }

  lastMagnitude = magnitude;
}

/** Start passive step counting. Returns a cleanup function. */
export function startStepCounter(onStepUpdate) {
  resetIfNewDay();
  stepCount = parseInt(localStorage.getItem(STORAGE_KEYS.STEPS_TODAY) || '0', 10);
  stepCallback = onStepUpdate;

  if (stepCallback) stepCallback(stepCount);

  if (stepListenerActive) return () => {};

  // Check for DeviceMotion support
  if (typeof DeviceMotionEvent === 'undefined') {
    return () => {};
  }

  // iOS 13+ requires permission
  if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    (DeviceMotionEvent as any).requestPermission()
      .then(state => {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
          stepListenerActive = true;
        }
      })
      .catch(() => {});
  } else {
    window.addEventListener('devicemotion', handleMotion);
    stepListenerActive = true;
  }

  return () => {
    window.removeEventListener('devicemotion', handleMotion);
    stepListenerActive = false;
    stepCallback = null;
  };
}

/** Get today's step count */
export function getSteps() {
  resetIfNewDay();
  return parseInt(localStorage.getItem(STORAGE_KEYS.STEPS_TODAY) || '0', 10);
}

// ─── SLEEP DETECTION ─────────────────────────────────────────────────────────

/** Record that the user is currently active (call on app open/focus) */
export function recordActivity() {
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, String(Date.now()));
}

/**
 * Check sleep status on app open.
 * If the user was inactive for 7+ hours AND last active after 9 PM IST → Good Sleep.
 * Otherwise → Poor Sleep or null (no overnight gap detected).
 * Returns: { status: 'good'|'poor'|null, sleepStart: Date|null, sleepEnd: Date|null }
 */
export function checkSleepStatus() {
  resetIfNewDay();
  const today = getTodayIST();

  // Already detected today?
  if (localStorage.getItem(STORAGE_KEYS.SLEEP_DATE) === today) {
    const status = localStorage.getItem(STORAGE_KEYS.SLEEP_STATUS);
    const window = localStorage.getItem(STORAGE_KEYS.SLEEP_WINDOW);
    if (status) {
      return {
        status,
        ...(window ? JSON.parse(window) : { sleepStart: null, sleepEnd: null }),
      };
    }
  }

  const lastActive = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE) || '0', 10);
  if (!lastActive) {
    recordActivity();
    return { status: null, sleepStart: null, sleepEnd: null };
  }

  const now = Date.now();
  const gapHours = (now - lastActive) / (1000 * 60 * 60);

  // Check if last active was after 9 PM IST
  const lastActiveDate = new Date(lastActive);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const lastActiveIST = new Date(lastActive + istOffset + lastActiveDate.getTimezoneOffset() * 60 * 1000);
  const lastActiveHour = lastActiveIST.getHours();

  let status: string | null = null;

  if (gapHours >= 7 && lastActiveHour >= 21) {
    status = 'good';
  } else if (gapHours >= 1 && lastActiveHour >= 21) {
    // They were gone overnight but less than 7 hours
    status = 'poor';
  }

  if (status) {
    localStorage.setItem(STORAGE_KEYS.SLEEP_STATUS, status);
    localStorage.setItem(STORAGE_KEYS.SLEEP_DATE, today);
    const sleepWindow = {
      sleepStart: new Date(lastActive).toISOString(),
      sleepEnd: new Date(now).toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.SLEEP_WINDOW, JSON.stringify(sleepWindow));
    return { status, ...sleepWindow };
  }

  recordActivity();
  return { status: null, sleepStart: null, sleepEnd: null };
}

// ─── WATER INTAKE TRACKING ───────────────────────────────────────────────────

/** Get today's confirmed water count */
export function getWaterCount() {
  resetIfNewDay();
  return parseInt(localStorage.getItem(STORAGE_KEYS.WATER_TODAY) || '0', 10);
}

/** Increment today's water count by 1 */
export function addWater() {
  resetIfNewDay();
  const current = getWaterCount();
  localStorage.setItem(STORAGE_KEYS.WATER_TODAY, String(current + 1));
  return current + 1;
}

/** Get the timestamp of last water acknowledgment */
export function getLastWaterAck() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.WATER_LAST_ACK) || '0', 10);
}

/** Record that the user just acknowledged a water reminder */
export function ackWater() {
  localStorage.setItem(STORAGE_KEYS.WATER_LAST_ACK, String(Date.now()));
}

/**
 * Calculate how many water reminders were missed since last ack.
 * Returns an array of { hour: 'HH:MM', timestamp: number } for each missed hour.
 */
export function getMissedWaterReminders() {
  const lastAck = getLastWaterAck();
  if (!lastAck) {
    // First time — set it to now, no missed reminders
    ackWater();
    return [];
  }

  const now = Date.now();
  const hoursSinceAck = (now - lastAck) / (1000 * 60 * 60);

  // Only create missed entries for full hours elapsed (min 1 hour)
  const missedCount = Math.floor(hoursSinceAck);
  if (missedCount < 1) return [];

  const missed: Array<{ hour: string; timestamp: number }> = [];
  for (let i = 1; i <= missedCount; i++) {
    const missedTime = new Date(lastAck + i * 60 * 60 * 1000);
    missed.push({
      hour: missedTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      timestamp: missedTime.getTime(),
    });
  }

  return missed;
}

/** Request browser notification permission */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

/** Send a browser notification for water reminder */
export function sendWaterNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('💧 Time to Hydrate!', {
        body: 'You\'ve been studying for an hour. Drink a glass of water!',
        icon: '💧',
        tag: 'water-reminder',
        requireInteraction: false,
      });
    } catch (e) {
      // Silent fail for environments that don't support Notification constructor
    }
  }
}
