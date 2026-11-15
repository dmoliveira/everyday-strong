import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { DAYS, cardioForWeek, defaultDate, doseTarget, exerciseGuide, isEasyWeek, mobility, phaseIndex, progressionSuggestion, sessionKey, setsForWeek, spacingWarning, weekForDate, workouts } from '../src/plan.js';
import { LEGACY_KEY, STORAGE_KEY, emptyState, loadState, makeBackup, migrateLegacy, readBackup, saveState } from '../src/state.js';

test('all 72 source slots have stable IDs, bilingual names, cues, and safe alternatives', () => {
  assert.equal(workouts.length, 4);
  assert.equal(mobility.length, 6);
  let slots = 0;
  const ids = new Map();
  for (const phase of workouts) for (const day of DAYS) {
    assert.equal(phase[day].length, 6);
    const sessionIds = new Set();
    for (const exercise of phase[day]) {
      slots++;
      for (const key of ['id', 'en', 'pt', 'muscle', 'why', 'how', 'dose']) assert.ok(exercise[key], `${key} missing`);
      assert.doesNotMatch(exercise.en, /deadlift/i);
      assert.match(exercise.id, /^[a-z0-9-]+$/);
      if (ids.has(exercise.id)) assert.equal(ids.get(exercise.id), exercise.en);
      ids.set(exercise.id, exercise.en);
      assert.ok(!sessionIds.has(exercise.id), 'IDs must be unique within a session');
      sessionIds.add(exercise.id);
      const guide = exerciseGuide(exercise);
      assert.ok(guide.equipment && guide.easy && guide.harder);
    }
  }
  assert.equal(slots, 72);
  const sourceFields = workouts.map(phase => DAYS.map(day => phase[day].map(({ en, pt, dose, how }) => ({ en, pt, dose, how }))));
  assert.equal(createHash('sha256').update(JSON.stringify(sourceFields)).digest('hex'), '186da8b15bf4c2314aca039a4fa333639d3b72b1aabd0af8fbcc0c992f49de2f', 'source names, doses, cues and order must not drift silently');
});

test('phase, introductory, cardio, and easy-week boundaries are correct', () => {
  assert.deepEqual([1, 13, 14, 26, 27, 39, 40, 52].map(phaseIndex), [0, 0, 1, 1, 2, 2, 3, 3]);
  assert.throws(() => phaseIndex(0), RangeError);
  assert.throws(() => phaseIndex(53), RangeError);
  assert.deepEqual([1, 2, 3, 4, 13, 14, 26, 39, 52].map(setsForWeek), ['1–2', '1–2', '2', '1–2', '1–2', '2–3', '1–2', '1–2', '1–2']);
  for (let week = 1; week <= 52; week++) assert.equal(isEasyWeek(week), week % 4 === 0 || [13, 26, 39, 52].includes(week));
  assert.deepEqual(cardioForWeek(1), { bike: '15–20', treadmill: '15–25' });
  assert.deepEqual(cardioForWeek(52), { bike: '30–40', treadmill: '25–45' });
});

test('local calendar uses Mondays and handles daylight-saving boundaries', () => {
  assert.equal(defaultDate('2025-10-05', 1, 'A'), '2025-09-30');
  assert.equal(defaultDate('2025-10-05', 2, 'A'), '2025-10-07');
  assert.equal(defaultDate('2025-10-05', 1, 'treadmill'), '2025-10-03');
  assert.equal(defaultDate('', 1, 'A'), '');
  assert.equal(weekForDate('2025-10-05', new Date(2025, 9, 6, 12)), 2);
  assert.equal(weekForDate('2025-10-05', new Date(2025, 8, 1, 12)), 1);
  assert.equal(weekForDate('2025-10-05', new Date(2028, 1, 1, 12)), 52);
  assert.ok(spacingWarning(['2026-03-01', '2026-03-02']));
  assert.ok(spacingWarning(['2026-03-02'], ['2026-03-01']));
  assert.equal(spacingWarning(['2026-03-02'], ['2026-03-04', '2026-03-05']), false);
  assert.equal(spacingWarning(['2026-02-30']), false);
});

test('legacy ticks use the frozen source template and preserve raw weekly check-ins', () => {
  const legacy = { done: { '1_A_0': true, '14_B_5': true, '52_C_2': true, '2_A_0': false, '99_A_0': true }, logs: { 1: { notes: 'Felt good', squats: '10' } }, startDate: '2026-01-05' };
  const state = migrateLegacy(legacy);
  assert.equal(state.done[sessionKey(1, 'A', workouts[0].A[0].id)], true);
  assert.equal(state.done[sessionKey(14, 'B', workouts[1].B[5].id)], true);
  assert.equal(state.done[sessionKey(52, 'C', workouts[3].C[2].id)], true);
  assert.equal(Object.keys(state.done).length, 3);
  assert.deepEqual(state.legacyBackup, legacy);
  assert.deepEqual(state.exerciseLogs, {});
  assert.equal(state.startDate, '2026-01-05');
  assert.deepEqual(readBackup(JSON.stringify(legacy)), state);
});

test('backup round-trips complete data, rejects invalid files, and storage failures do not overwrite data', () => {
  const state = emptyState();
  const key = sessionKey(1, 'A', workouts[0].A[0].id);
  state.done[key] = true;
  state.exerciseLogs[key] = { variation: 'chair', discomfort: 'none', skipped: false, notes: 'steady', sets: [{ value: '12', unit: 'reps', weight: '2', band: 'green', rir: '3' }] };
  state.cardio['1:bike'] = { done: true, date: '2026-01-05', minutes: '20', rpe: '3', speed: '', incline: '', resistance: '2', cadence: '60', notes: 'easy' };
  state.scheduled['1:A'] = '2026-01-07';
  state.legacyBackup = { done: {}, logs: { 1: { notes: 'old' } }, startDate: '' };
  assert.deepEqual(readBackup(JSON.stringify(makeBackup(state))), state);
  assert.throws(() => readBackup('{bad'), /JSON/);
  assert.throws(() => readBackup(JSON.stringify({ format: 'everyday-strong-backup', version: 2, data: { ...state, week: 53 } })), /invalid/i);
  assert.throws(() => readBackup(JSON.stringify({ format: 'everyday-strong-backup', version: 2, data: { ...state, done: { '__proto__:A:no': true } } })), /completion/i);
  const values = new Map([[STORAGE_KEY, '{unreadable']]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const loaded = loadState(storage);
  assert.equal(loaded.persistent, false);
  assert.equal(values.get(STORAGE_KEY), '{unreadable');
  assert.equal(saveState({ setItem() { throw new Error('quota'); } }, state), false);
  assert.equal(saveState(storage, state), true);
  assert.deepEqual(loadState(storage).state, state);
  const legacyStorage = { getItem: key => key === LEGACY_KEY ? JSON.stringify({ done: { '1_A_0': true }, logs: {}, startDate: '' }) : null };
  assert.equal(loadState(legacyStorage).migrated, true);
});

test('progression requires two comparable non-easy, comfortable, fully logged occurrences', () => {
  const state = emptyState(), exercise = workouts[0].A[0];
  const log = () => ({ variation: 'chair', discomfort: 'none', skipped: false, notes: '', sets: [{ value: '12', unit: 'reps', weight: '', band: '', rir: '3' }] });
  for (const week of [1, 2]) { const key = sessionKey(week, 'A', exercise.id); state.done[key] = true; state.exerciseLogs[key] = log(); }
  assert.deepEqual(progressionSuggestion(state, exercise, 'A', 3).weeks, [1, 2]);
  assert.equal(progressionSuggestion(state, exercise, 'A', 4), null, 'do not prompt progression during an easy week');
  const second = state.exerciseLogs[sessionKey(2, 'A', exercise.id)];
  second.discomfort = 'yes'; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  second.discomfort = 'none'; second.variation = 'lower chair'; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  second.variation = ''; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  second.variation = 'chair'; second.sets[0].rir = '1'; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  second.sets[0].rir = '99'; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  second.sets[0].rir = '3'; second.skipped = true; assert.equal(progressionSuggestion(state, exercise, 'A', 3), null);
  assert.equal(doseTarget('20–40 sec or 6–10 taps / side'), null);
});
