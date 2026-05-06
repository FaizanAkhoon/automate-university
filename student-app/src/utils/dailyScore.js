// ─── DAILY SCORE SYSTEM ──────────────────────────────────────────────────────
// Tracks daily student activities and calculates a productivity/wellness score.
// Day ends at 6:00 PM IST — at that point the score is finalized and saved.
// Each activity earns/loses points. Study & learning activities earn the most.

const SCORE_KEYS = {
  SCORE_TODAY: 'daily_score_today',
  SCORE_DATE: 'daily_score_date',
  SCORE_LOG: 'daily_score_log',        // JSON array of { action, points, time }
  SCORE_HISTORY: 'daily_score_history', // JSON array of { date, score, log }
  SCORE_FINALIZED: 'daily_score_finalized',
};

// ─── POINT VALUES ────────────────────────────────────────────────────────────
// Positive points for productive activities, negative for missed goals.
export const ACTIVITY_POINTS = {
  // Study & Learning (highest value)
  study_session_complete: { points: +25, label: 'Completed a study session' },
  pomodoro_complete:      { points: +20, label: 'Finished Pomodoro timer' },
  cs_book_read:           { points: +15, label: 'Read CS Book content' },
  video_watched:          { points: +15, label: 'Watched learning video' },
  notes_summarized:       { points: +12, label: 'Summarized notes' },

  // Health & Wellness
  water_logged:           { points: +5,  label: 'Drank water' },
  good_sleep:             { points: +10, label: 'Good sleep detected' },
  steps_goal:             { points: +10, label: 'Steps goal reached' },

  // Community & Engagement
  community_post:         { points: +8,  label: 'Posted on community board' },
  voice_nav_used:         { points: +3,  label: 'Used voice navigator' },
  app_login:              { points: +5,  label: 'Daily login bonus' },

  // Penalties (negative)
  water_missed:           { points: -3,  label: 'Missed water reminder' },
  poor_sleep:             { points: -5,  label: 'Poor sleep detected' },
  no_study:               { points: -10, label: 'No study session today' },
  low_steps:              { points: -5,  label: 'Very few steps today' },
};

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

/** Get today's date string in IST (YYYY-MM-DD) */
function getTodayIST() {
  const now = new Date();
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

// ─── CORE FUNCTIONS ──────────────────────────────────────────────────────────

/** Reset daily score if the date has changed */
function resetIfNewDay() {
  const today = getTodayIST();
  const storedDate = localStorage.getItem(SCORE_KEYS.SCORE_DATE);
  
  if (storedDate !== today) {
    // If there was a previous day, finalize it before resetting
    if (storedDate) {
      finalizeDay(storedDate);
    }
    localStorage.setItem(SCORE_KEYS.SCORE_TODAY, '0');
    localStorage.setItem(SCORE_KEYS.SCORE_DATE, today);
    localStorage.setItem(SCORE_KEYS.SCORE_LOG, '[]');
    localStorage.setItem(SCORE_KEYS.SCORE_FINALIZED, 'false');
  }
}

/** Finalize a day's score and save to history */
function finalizeDay(date) {
  const score = parseInt(localStorage.getItem(SCORE_KEYS.SCORE_TODAY) || '0', 10);
  const log = JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_LOG) || '[]');
  
  const history = JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_HISTORY) || '[]');
  
  // Check if this date is already finalized
  if (history.some(h => h.date === date)) return;
  
  // Apply end-of-day penalties
  const studyDone = log.some(l => 
    l.action === 'study_session_complete' || 
    l.action === 'pomodoro_complete' ||
    l.action === 'cs_book_read' ||
    l.action === 'video_watched'
  );
  
  let finalScore = score;
  const finalLog = [...log];
  
  if (!studyDone) {
    finalScore += ACTIVITY_POINTS.no_study.points;
    finalLog.push({ action: 'no_study', points: ACTIVITY_POINTS.no_study.points, time: new Date().toISOString() });
  }
  
  history.push({ date, score: finalScore, log: finalLog });
  
  // Keep only last 30 days
  while (history.length > 30) history.shift();
  
  localStorage.setItem(SCORE_KEYS.SCORE_HISTORY, JSON.stringify(history));
  localStorage.setItem(SCORE_KEYS.SCORE_FINALIZED, 'true');
}

/** Add points for an activity */
export function addScore(activityKey) {
  resetIfNewDay();
  
  const activity = ACTIVITY_POINTS[activityKey];
  if (!activity) return 0;
  
  const currentScore = parseInt(localStorage.getItem(SCORE_KEYS.SCORE_TODAY) || '0', 10);
  const newScore = currentScore + activity.points;
  localStorage.setItem(SCORE_KEYS.SCORE_TODAY, String(newScore));
  
  // Log the action
  const log = JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_LOG) || '[]');
  log.push({
    action: activityKey,
    points: activity.points,
    time: new Date().toISOString(),
  });
  localStorage.setItem(SCORE_KEYS.SCORE_LOG, JSON.stringify(log));
  
  return newScore;
}

/** Get today's current score */
export function getDailyScore() {
  resetIfNewDay();
  return parseInt(localStorage.getItem(SCORE_KEYS.SCORE_TODAY) || '0', 10);
}

/** Get today's activity log */
export function getDailyLog() {
  resetIfNewDay();
  return JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_LOG) || '[]');
}

/** Get score history (last 30 days) */
export function getScoreHistory() {
  return JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_HISTORY) || '[]');
}

/** Check if the day should be finalized (6 PM IST) */
export function checkDayEnd() {
  resetIfNewDay();
  const hour = getCurrentHourIST();
  const finalized = localStorage.getItem(SCORE_KEYS.SCORE_FINALIZED) === 'true';
  
  if (hour >= 18 && !finalized) {
    const today = getTodayIST();
    finalizeDay(today);
    return true; // day just ended
  }
  return false;
}

/** Award daily login bonus (once per day) */
export function awardLoginBonus() {
  resetIfNewDay();
  const log = JSON.parse(localStorage.getItem(SCORE_KEYS.SCORE_LOG) || '[]');
  if (!log.some(l => l.action === 'app_login')) {
    addScore('app_login');
  }
}
