import { DAYS, parseDate, phaseIndex, sessionKey, workouts } from './plan.js';

export const STORAGE_KEY = 'everyday_strong_v2';
export const LEGACY_KEY = 'homefit52_v1';
export const MAX_BACKUP_SIZE = 5 * 1024 * 1024;

export function emptyState() {
  return { version: 2, week: 1, day: 'A', startDate: '', done: {}, exerciseLogs: {}, cardio: {}, scheduled: {}, legacyBackup: null };
}

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function requireObject(value, label) { if (!object(value)) throw new Error(`Invalid ${label}.`); return value; }
function text(value, label, max = 2000) {
  if (typeof value !== 'string' || value.length > max) throw new Error(`Invalid ${label}.`);
  return value;
}
function date(value, label) {
  text(value, label, 10);
  if (value && !parseDate(value)) throw new Error(`Invalid ${label}.`);
  return value;
}
function validExerciseKey(key) {
  const match = /^(\d{1,2}):(A|B|C):([a-z0-9-]+)$/.exec(key);
  if (!match) return false;
  const week = Number(match[1]);
  return week >= 1 && week <= 52 && workouts[phaseIndex(week)][match[2]].some(exercise => exercise.id === match[3]);
}
function validWeekKey(key, kinds) {
  const match = /^(\d{1,2}):([A-Za-z]+)$/.exec(key);
  return !!match && Number(match[1]) >= 1 && Number(match[1]) <= 52 && kinds.includes(match[2]);
}
function entries(value, label, max) {
  const list = Object.entries(requireObject(value, label));
  if (list.length > max) throw new Error(`Too many entries in ${label}.`);
  return list;
}
function cleanLegacy(value) {
  if (value === null) return null;
  requireObject(value, 'legacy backup');
  requireObject(value.done, 'legacy completion data');
  requireObject(value.logs, 'legacy check-ins');
  date(value.startDate || '', 'legacy start date');
  if (JSON.stringify(value).length > MAX_BACKUP_SIZE) throw new Error('Legacy backup is too large.');
  return JSON.parse(JSON.stringify(value));
}

// Reconstruct only known fields. Never merge arbitrary imported object keys into state.
export function validateState(value) {
  requireObject(value, 'backup data');
  if (value.version !== 2 || !Number.isInteger(value.week) || value.week < 1 || value.week > 52 || !DAYS.includes(value.day)) throw new Error('Unsupported or invalid backup version.');
  const state = emptyState();
  state.week = value.week;
  state.day = value.day;
  state.startDate = date(value.startDate, 'start date');
  for (const [key, completed] of entries(value.done, 'completion data', 1000)) {
    if (!validExerciseKey(key) || typeof completed !== 'boolean') throw new Error('Invalid exercise completion entry.');
    state.done[key] = completed;
  }
  for (const [key, log] of entries(value.exerciseLogs, 'exercise logs', 1000)) {
    if (!validExerciseKey(key)) throw new Error('Invalid exercise log key.');
    requireObject(log, 'exercise log');
    if (!Array.isArray(log.sets) || log.sets.length > 30 || typeof log.skipped !== 'boolean' || !['unknown', 'none', 'yes'].includes(log.discomfort)) throw new Error('Invalid exercise log.');
    state.exerciseLogs[key] = {
      variation: text(log.variation, 'variation', 200), discomfort: log.discomfort, skipped: log.skipped,
      notes: text(log.notes, 'exercise notes'),
      sets: log.sets.map(set => {
        requireObject(set, 'set');
        if (!['reps', 'seconds'].includes(set.unit)) throw new Error('Invalid set unit.');
        return { value: text(set.value, 'set value', 64), unit: set.unit, weight: text(set.weight, 'weight', 64), band: text(set.band, 'band', 200), rir: text(set.rir, 'repetitions in reserve', 64) };
      }),
    };
  }
  for (const [key, log] of entries(value.cardio, 'cardio logs', 104)) {
    if (!validWeekKey(key, ['bike', 'treadmill'])) throw new Error('Invalid cardio log key.');
    requireObject(log, 'cardio log');
    if (typeof log.done !== 'boolean') throw new Error('Invalid cardio completion.');
    state.cardio[key] = {
      done: log.done, date: date(log.date, 'cardio date'), minutes: text(log.minutes, 'cardio minutes', 64),
      rpe: text(log.rpe, 'cardio effort', 64), speed: text(log.speed, 'cardio speed', 64),
      incline: text(log.incline, 'cardio incline', 64), resistance: text(log.resistance, 'bike resistance', 200),
      cadence: text(log.cadence, 'bike cadence', 64), notes: text(log.notes, 'cardio notes'),
    };
  }
  for (const [key, scheduled] of entries(value.scheduled, 'scheduled dates', 156)) {
    if (!validWeekKey(key, DAYS)) throw new Error('Invalid scheduled session key.');
    state.scheduled[key] = date(scheduled, 'scheduled date');
  }
  state.legacyBackup = cleanLegacy(value.legacyBackup);
  return state;
}

export function migrateLegacy(legacy) {
  const saved = cleanLegacy(legacy);
  const state = emptyState();
  state.startDate = saved.startDate || '';
  state.legacyBackup = saved;
  for (const [key, done] of Object.entries(saved.done)) {
    const match = /^(\d{1,2})_(A|B|C)_(\d+)$/.exec(key);
    if (!match || !done) continue;
    const week = Number(match[1]);
    if (week < 1 || week > 52) continue;
    const exercise = workouts[phaseIndex(week)][match[2]][Number(match[3])];
    if (exercise) state.done[sessionKey(week, match[2], exercise.id)] = true;
  }
  return state;
}

export function makeBackup(state) {
  return { format: 'everyday-strong-backup', version: 2, exportedAt: new Date().toISOString(), data: validateState(state) };
}

export function readBackup(contents) {
  if (typeof contents !== 'string' || contents.length > MAX_BACKUP_SIZE) throw new Error('The backup is too large.');
  let value;
  try { value = JSON.parse(contents); } catch { throw new Error('This is not a valid JSON file.'); }
  if (value?.format === 'everyday-strong-backup' && value.version === 2) return validateState(value.data);
  if (object(value) && object(value.done) && object(value.logs)) return migrateLegacy(value);
  throw new Error('This is not an Everyday Strong or original Home Fitness 52 backup.');
}

export function loadState(storage) {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) return { state: validateState(JSON.parse(current)), migrated: false, persistent: true };
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy !== null) return { state: migrateLegacy(JSON.parse(legacy)), migrated: true, persistent: true };
    return { state: emptyState(), migrated: false, persistent: true };
  } catch {
    // Preserve any existing unreadable data: do not overwrite it automatically.
    return { state: emptyState(), migrated: false, persistent: false };
  }
}

export function saveState(storage, state) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(validateState(state))); return true; } catch { return false; }
}
