import { planData } from './plan-data.js';

export const { phases, workouts, mobility } = planData;
export const DAYS = ['A', 'B', 'C'];

export function phaseIndex(week) {
  if (!Number.isInteger(week) || week < 1 || week > 52) throw new RangeError('Week must be between 1 and 52');
  return Math.floor((week - 1) / 13);
}

export function isEasyWeek(week) {
  phaseIndex(week);
  return week % 4 === 0 || [13, 26, 39, 52].includes(week);
}

export function setsForWeek(week) {
  return isEasyWeek(week) || week <= 2 ? '1–2' : week <= 13 ? '2' : '2–3';
}

export function cardioForWeek(week) {
  return [
    { bike: '15–20', treadmill: '15–25' },
    { bike: '20–30', treadmill: '20–35' },
    { bike: '25–35', treadmill: '25–40' },
    { bike: '30–40', treadmill: '25–45' },
  ][phaseIndex(week)];
}

// UTC calendar arithmetic avoids daylight-saving and date-only parsing surprises.
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function mondayOf(date) {
  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  return monday;
}

export function weekForDate(startDate, today = new Date()) {
  const start = parseDate(startDate);
  if (!start) return 1;
  const todayCalendar = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  return Math.max(1, Math.min(52, Math.floor((todayCalendar - mondayOf(start)) / 604800000) + 1));
}

export function defaultDate(startDate, week, day) {
  const start = parseDate(startDate);
  const dayOffset = { bike: 0, A: 1, B: 3, treadmill: 4, C: 5 }[day];
  if (!start || dayOffset === undefined) return '';
  const date = mondayOf(start);
  date.setUTCDate(date.getUTCDate() + (week - 1) * 7 + dayOffset);
  const iso = date.toISOString();
  return /^\d{4}-/.test(iso) ? iso.slice(0, 10) : '';
}

export function dateLabel(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date) : '';
}

export function spacingWarning(dates, otherDates = []) {
  const current = dates.map(parseDate).filter(Boolean);
  const others = otherDates.map(parseDate).filter(Boolean);
  return current.some((date, index) =>
    current.slice(index + 1).some(other => Math.abs(date - other) < 2 * 86400000) ||
    others.some(other => Math.abs(date - other) < 2 * 86400000));
}

// Explicit movement-family guidance is a choice aid, not a diagnosis or a prescription.
const guides = {
  squat: ['Chair; bodyweight or optional light dumbbells', 'Use a sturdy chair and a shallower comfortable range.', 'Use a controlled lowering phase or a supported single-leg variation.'],
  lunge: ['Sturdy chair or low, secure step; bodyweight', 'Hold a support and use a smaller comfortable range, or choose a chair squat.', 'Slow the lowering phase while keeping secure support.'],
  push: ['Wall or other stable raised surface; bodyweight', 'Try a wall push-up or a higher stable surface.', 'Use a slightly lower stable surface only if every rep stays controlled.'],
  row: ['Resistance band', 'Use a lighter band or less tension.', 'Try a slightly firmer band or pause briefly at the end of the pull.'],
  bridge: ['Floor or mat; bodyweight', 'Use a comfortable two-foot glute bridge; reduce range if needed.', 'Try an assisted single-leg bridge or a small heel walkout if comfortable.'],
  press: ['Light dumbbells, or perform without weights', 'Reduce the range or skip the overhead press if uncomfortable.', 'Increase control or use a slightly heavier comfortable load if available.'],
  pullapart: ['Light resistance band', 'Use a lighter band and a smaller comfortable range.', 'Use a slightly firmer band without shrugging.'],
  calf: ['Stable support; bodyweight', 'Use both legs and hold a sturdy support.', 'Use one leg with support and a controlled lowering phase.'],
  plank: ['Floor or mat; bodyweight'],
  crunch: ['Floor or mat; bodyweight'],
  deadbug: ['Floor or mat; bodyweight'],
  birddog: ['Floor or mat; bodyweight'],
  sideleg: ['Floor or mat; bodyweight or optional light band'],
  curl: ['Resistance band'],
  triceps: ['Resistance band'],
};
const alternatives = {
  plank: ['Keep knees supported or shorten the hold.', 'Increase the hold modestly or try a more challenging supported variation.'],
  crunch: ['Use a smaller comfortable range without pulling the neck.', 'Slow the movement and pause briefly without swinging.'],
  deadbug: ['Move one limb at a time through a smaller range.', 'Move more slowly while keeping your trunk steady.'],
  birddog: ['Reach only an arm or a leg at a time.', 'Pause briefly while keeping your hips level.'],
  sideleg: ['Use a smaller range without a band.', 'Add a light band if the movement remains controlled.'],
  curl: ['Use a lighter band or reduce tension.', 'Try a slightly firmer band without swinging.'],
  triceps: ['Use a lighter band and comfortable shoulder position.', 'Try slightly more tension while keeping the band secure.'],
};

export function movementFamily(name) {
  const n = name.toLowerCase();
  if (/walkout|bridge/.test(n)) return 'bridge';
  if (/step-up|lunge|split squat/.test(n)) return 'lunge';
  if (/squat|sit-to-stand/.test(n)) return 'squat';
  if (/push-up/.test(n)) return 'push';
  if (/row/.test(n)) return 'row';
  if (/shoulder press|dumbbell press/.test(n)) return 'press';
  if (/pull-apart/.test(n)) return 'pullapart';
  if (/calf raise/.test(n)) return 'calf';
  if (/plank/.test(n)) return 'plank';
  if (/crunch/.test(n)) return 'crunch';
  if (/dead bug/.test(n)) return 'deadbug';
  if (/bird dog/.test(n)) return 'birddog';
  if (/clamshell|abduction/.test(n)) return 'sideleg';
  if (/curl/.test(n)) return 'curl';
  if (/triceps/.test(n)) return 'triceps';
  return 'other';
}

export function exerciseGuide(exercise) {
  const family = movementFamily(exercise.en);
  const guide = guides[family] || ['Bodyweight and a stable support if needed', 'Use a comfortable supported range.', 'Progress gradually only while the movement remains controlled.'];
  const [equipment, easy, harder] = guide;
  const fallback = alternatives[family] || [];
  return { family, equipment, easy: easy || fallback[0], harder: harder || fallback[1] };
}

export function sessionKey(week, day, id) { return `${week}:${day}:${id}`; }

// Only unambiguous single-unit doses are used for suggestions.
export function doseTarget(dose) {
  const match = /^(\d+)–(\d+)( sec)?(?: \/ (?:side|leg))?$/.exec(dose);
  return match ? { upper: Number(match[2]), unit: match[3] ? 'seconds' : 'reps' } : null;
}

export function progressionSuggestion(state, exercise, day, currentWeek) {
  const target = doseTarget(exercise.dose);
  if (!target || isEasyWeek(currentWeek)) return null;
  const matches = [];
  for (let week = 1; week <= currentWeek; week++) {
    if (isEasyWeek(week)) continue;
    const prescribed = workouts[phaseIndex(week)][day].find(item => item.id === exercise.id && item.dose === exercise.dose);
    if (!prescribed) continue;
    const key = sessionKey(week, day, exercise.id);
    const log = state.exerciseLogs[key];
    const minimumSets = Number(setsForWeek(week).split('–')[0]);
    if (!state.done[key] || !log || log.skipped || !log.variation.trim() || log.discomfort !== 'none' || log.sets.length < minimumSets) continue;
    if (!log.sets.every(set => set.unit === target.unit && set.value !== '' && Number.isFinite(Number(set.value)) && Number(set.value) >= target.upper && set.rir !== '' && Number.isFinite(Number(set.rir)) && Number(set.rir) >= 2 && Number(set.rir) <= 10)) continue;
    const signature = JSON.stringify([log.variation.trim().toLowerCase(), log.sets.map(set => [set.weight.trim(), set.band.trim().toLowerCase()])]);
    const earlier = matches.find(item => item.signature === signature);
    if (earlier) return { weeks: [earlier.week, week], suggestion: exerciseGuide(exercise).harder };
    matches.push({ week, signature });
  }
  return null;
}
