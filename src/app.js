import { DAYS, WEEKDAYS, cardioForWeek, dateLabel, defaultDate, doseTarget, exerciseGuide, isEasyWeek, mobility, phaseIndex, phases, progressionSuggestion, sessionKey, spacingWarning, targetSetsForWeek, weekForDate, weeklySpacingWarning, workouts } from './plan.js';
import { MAX_BACKUP_SIZE, emptyState, loadState, makeBackup, readBackup, saveState, setPreferredDay } from './state.js';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const checked = value => value ? ' checked' : '';
const selected = (actual, expected) => actual === expected ? ' selected' : '';
const DAY_INFO = { A: 'Legs · push · pull · core', B: 'Single-leg · shoulders · core', C: 'Full body · core' };
const blankExerciseLog = () => ({ variation: '', discomfort: 'unknown', skipped: false, substituted: false, notes: '', sets: [] });
const blankCardio = () => ({ done: false, date: '', minutes: '', rpe: '', speed: '', incline: '', resistance: '', cadence: '', notes: '' });
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { throw new Error('Storage unavailable'); } }; }
const loaded = loadState(storage);
let state = loaded.state || emptyState();
let persistent = loaded.persistent;
let openExercises = new Set();
let timerRemaining = state.settings.restSeconds * 1000, timerDeadline = null, timerInterval = null;

function announce(message) { $('announcement').textContent = message; }
function storageMessage() {
  $('storage-status').textContent = persistent
    ? (state.legacyBackup ? 'Original exercise ticks were imported from an older plan. Original check-ins are retained in your JSON backup; they are not individual sets.' : 'Changes save automatically in this browser. No account is required.')
    : 'Browser storage is unavailable or existing data could not be read. Changes are temporary; download a backup before leaving. Existing data has not been overwritten.';
  $('storage-notice').hidden = persistent;
  $('storage-notice').textContent = persistent ? '' : 'Your changes cannot be saved in this browser right now. They are temporary; download a backup before leaving.';
}
function persist() {
  if (persistent && !saveState(storage, state)) persistent = false;
  storageMessage();
}
function exerciseLog(key) { return state.exerciseLogs[key] ||= blankExerciseLog(); }
function cardioLog(kind) { return state.cardio[`${state.week}:${kind}`] ||= blankCardio(); }
function scheduledDate(week, day) {
  const key = `${week}:${day}`;
  return Object.hasOwn(state.scheduled, key) ? state.scheduled[key] : defaultDate(state.startDate, week, day, state.settings.days);
}
function usualDay(day) { return WEEKDAYS[state.settings.days[day]]; }
function currentSetText() {
  const sets = targetSetsForWeek(state.week, state.settings.sets);
  return `${sets} ${sets === '1' ? 'set' : 'sets'}`;
}
function sessionDescription() { return `${DAY_INFO[state.day]} · ${currentSetText()} per movement · ${countDay(state.week, state.day)} of 6 ticked`; }
function countDay(week, day) {
  return workouts[phaseIndex(week)][day].filter(ex => state.done[sessionKey(week, day, ex.id)]).length;
}
function finishedDay(week, day) { return countDay(week, day) === workouts[phaseIndex(week)][day].length; }
function completedWeek(week) { return DAYS.filter(day => finishedDay(week, day)).length; }
function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function setWeek(week) {
  state.week = week;
  openExercises = new Set();
  persist();
  render();
  announce(`Week ${week} selected.`);
}
function setDay(day, scroll = false) {
  state.day = day;
  openExercises = new Set();
  persist();
  renderOverview();
  renderSchedule();
  renderWorkout();
  $('day-tabs').querySelector(`[data-select-day="${day}"]`).focus({ preventScroll: true });
  if (scroll) $('workout').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  announce(`Workout ${day} selected.`);
}
function renderSetup() {
  for (const day of DAYS) $(`preferred-${day}`).value = String(state.settings.days[day]);
  $('sets-goal').value = state.settings.sets;
  $('rest-duration').value = String(state.settings.restSeconds);
  $('setup-summary').textContent = `${DAYS.map(day => `${day} ${usualDay(day).slice(0, 3)}`).join(' · ')}  |  ${state.settings.sets === 'plan' ? 'Plan sets' : `${state.settings.sets} set goal`}`;
}
function renderOverview() {
  const week = state.week, phase = phaseIndex(week), easy = isEasyWeek(week), done = completedWeek(week);
  $('week-select').value = String(week);
  $('start-date').value = state.startDate;
  $('week-overview').innerHTML = `<div class="week-banner"><div><span class="micro-label">WEEK ${week} OF 52 · PHASE ${phase + 1}</span><h3>${esc(phases[phase].title)}</h3><p>${esc(phases[phase].goal)}</p></div><span class="week-badge">${easy ? 'EASY / REVIEW WEEK ✳' : 'YOU’VE GOT THIS ✳'}</span><div class="week-progress"><span class="micro-label">THIS WEEK'S STRENGTH</span><strong>${done} / 3 sessions</strong><div class="meter" role="progressbar" aria-label="Strength sessions completed this week" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${done}"><span style="width:${done / 3 * 100}%"></span></div></div></div><div class="phase-line" role="img" aria-label="Phase ${phase + 1} of 4">${phases.map((_, i) => `<span class="${i === phase ? 'active' : ''}"></span>`).join('')}</div>`;
}
function renderSchedule() {
  const week = state.week, cardio = cardioForWeek(week), today = localToday();
  // Columns are usual days. Explicit dates may move an individual session elsewhere.
  $('schedule').innerHTML = WEEKDAYS.map((dayName, index) => {
    const entries = [];
    if (index === 0 || index === 4) {
      const kind = index === 0 ? 'bike' : 'treadmill';
      const value = state.cardio[`${week}:${kind}`]?.date || defaultDate(state.startDate, week, kind);
      entries.push(`<a class="schedule-entry cardio-entry" href="#cardio"><strong>${kind === 'bike' ? 'Bike' : 'Treadmill'}</strong><small>${value ? `${esc(dateLabel(value))} · ` : ''}${cardio[kind]} min</small></a>`);
    }
    for (const day of DAYS.filter(item => state.settings.days[item] === index)) {
      const value = scheduledDate(week, day);
      const when = value ? `${dateLabel(value)}${value === today ? ' · today' : ''}` : 'No date set';
      entries.push(`<button type="button" class="schedule-entry strength-entry ${state.day === day ? 'selected' : ''}" data-select-day="${day}" aria-pressed="${state.day === day}"><strong>Strength ${day}</strong><small>${esc(when)}</small><small>${countDay(week, day)} / 6 movements</small></button>`);
    }
    if (!entries.length) entries.push('<div class="schedule-entry recovery-entry"><strong>Recovery</strong><small>Rest or gentle mobility</small></div>');
    return `<div class="schedule-card"><span class="day-name">${dayName.slice(0, 3).toUpperCase()} · USUAL</span>${entries.join('')}</div>`;
  }).join('');
  const dates = DAYS.map(day => scheduledDate(week, day));
  const otherDates = [];
  for (let otherWeek = 1; otherWeek <= 52; otherWeek++) {
    if (otherWeek !== week) for (const day of DAYS) otherDates.push(scheduledDate(otherWeek, day));
  }
  const dateConflict = spacingWarning(dates, otherDates);
  const patternConflict = weeklySpacingWarning(state.settings.days);
  $('spacing-warning').innerHTML = dateConflict || patternConflict ? `<p class="warning-box"><strong>Give recovery some room.</strong> ${dateConflict ? 'Two strength sessions are scheduled on the same or adjacent days.' : 'Your usual strength days include the same or adjacent days, including across weeks.'} Consider moving one, or choosing an easier session if needed.</p>` : '';
}
function renderWorkout() {
  const week = state.week, day = state.day, phase = phaseIndex(week), list = workouts[phase][day];
  $('day-tabs').innerHTML = DAYS.map(d => `<button type="button" data-select-day="${d}" aria-pressed="${d === day}" aria-label="Workout ${d}, usually ${usualDay(d)}">${d}</button>`).join('');
  const capped = state.settings.sets === '3' && (week <= 2 || isEasyWeek(week));
  $('session-summary').innerHTML = `<div class="session-summary"><div><span class="micro-label">USUALLY ${usualDay(day).toUpperCase()} · FULL BODY</span><h4>Workout ${day} <span aria-hidden="true">✳</span></h4><p>${sessionDescription()}</p><p>${capped ? 'Your three-set goal is capped at two for this introductory or easy week.' : isEasyWeek(week) ? 'Keep it comfortable; this is an easier or review week.' : 'Leave roughly 2–3 controlled reps in reserve.'}</p></div><div class="date-editor"><label>Move this session (optional)<input type="date" id="session-date" value="${esc(scheduledDate(week, day))}"></label></div></div>`;
  $('exercise-list').innerHTML = list.map((exercise, index) => exerciseCard(exercise, index)).join('');
}
function exerciseCard(exercise, index) {
  const key = sessionKey(state.week, state.day, exercise.id);
  const log = state.exerciseLogs[key] || blankExerciseLog();
  const guide = exerciseGuide(exercise);
  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.en} exercise how to proper technique physical therapist`)}`;
  return `<article class="exercise-card ${state.done[key] ? 'completed' : ''}" data-exercise="${esc(exercise.id)}"><div class="exercise-top"><span class="exercise-number">${String(index + 1).padStart(2, '0')}</span><div><h4>${esc(exercise.en)}</h4><p class="exercise-pt" lang="pt-BR">${esc(exercise.pt)}</p><p class="exercise-meta">${esc(currentSetText())} × ${esc(exercise.dose)} · ${esc(exercise.muscle)}</p><p class="variation-tag"${log.substituted && log.variation ? '' : ' hidden'}>${log.substituted && log.variation ? `Your alternative: ${esc(log.variation)}` : ''}</p></div><label class="done-label"><input type="checkbox" data-action="done"${checked(state.done[key])} aria-label="Mark ${esc(exercise.en)} completed"> Done</label></div>
  <details class="exercise-detail" data-details="${esc(exercise.id)}"${openExercises.has(exercise.id) ? ' open' : ''}><summary>How to do it + log sets</summary><div class="detail-body"><div class="detail-grid"><div class="detail-block"><strong>How to move</strong><p>${esc(exercise.how)}</p></div><div class="detail-block"><strong>Why it's here</strong><p>${esc(exercise.why)}</p></div><div class="detail-block"><strong>Make it easier</strong><p>${esc(guide.easy)}</p></div><div class="detail-block"><strong>Build gradually</strong><p>${esc(guide.harder)}</p></div><div class="detail-block wide-field"><strong>What you'll need</strong><p>${esc(guide.equipment)}</p></div></div><a class="video-link" href="${esc(search)}" target="_blank" rel="noopener noreferrer">Find a video demonstration ↗<span class="sr-only"> (opens YouTube in a new tab)</span></a><p class="video-note">Search results are not vetted. Choose a qualified professional and check the variation matches your equipment.</p>
  <div class="log-area"><h5>Your notes &amp; sets</h5><p>Optional. The Done tick records a movement, not individual sets. Your entries stay on this device.</p><div class="log-fields"><label>Quick-fill a variation<select data-variation-preset><option value="">Choose an example (optional)</option>${guide.variations.map(variation => `<option value="${esc(variation)}"${selected(log.substituted ? log.variation : '', variation)}>${esc(variation)}</option>`).join('')}</select></label><label>Variation used<input type="text" maxlength="200" data-log-field="variation" value="${esc(log.variation)}" placeholder="e.g. wall push-up"></label><label>Discomfort?<select data-log-field="discomfort"><option value="unknown"${selected(log.discomfort, 'unknown')}>Not recorded</option><option value="none"${selected(log.discomfort, 'none')}>No discomfort</option><option value="yes"${selected(log.discomfort, 'yes')}>Yes / unsure</option></select></label><label class="done-label"><input type="checkbox" data-log-field="substituted"${checked(log.substituted)}> I used an alternative</label><label class="done-label"><input type="checkbox" data-log-field="skipped"${checked(log.skipped)}> Skipped this movement</label><p class="substitution-note wide-field"${log.substituted ? '' : ' hidden'}>The displayed reps are for the original movement, not a prescription for an alternative. Choose a comfortable option; ask a qualified professional if unsure. Alternatives are excluded from automatic progression tips.</p><label class="wide-field">Notes / reason for a change<textarea rows="2" maxlength="2000" data-log-field="notes" placeholder="Optional notes">${esc(log.notes)}</textarea></label></div><div class="set-list">${log.sets.map((set, i) => setFields(set, i)).join('')}</div><button class="button outline small-button add-set" type="button" data-action="add-set">+ Add a set</button> ${log.sets.length ? '<button class="link-button" type="button" data-action="repeat-set">Repeat last set</button>' : ''}<div class="progression-slot">${progressionHtml(exercise)}</div></div></div></details></article>`;
}
function progressionHtml(exercise) {
  const progress = progressionSuggestion(state, exercise, state.day, state.week);
  return progress ? `<div class="tip"><strong>Consider one small progression.</strong> In weeks ${progress.weeks.join(' and ')}, the recorded sets met the original and current set minimums and reached the top of the original range, with at least 2 reps in reserve, no discomfort recorded, and matching variation and recorded resistance fields (which may be blank). ${esc(progress.suggestion)} This is a suggestion, not a medical rule; stay at this level if you prefer.</div>` : '<p class="video-note">Progression tips use comparable completed sessions of the original movement, with a recorded variation, sets and at least 2 reps in reserve. Alternatives are not compared.</p>';
}
function refreshProgression(card) {
  const exercise = workouts[phaseIndex(state.week)][state.day].find(item => item.id === card.dataset.exercise);
  const slot = card.querySelector('.progression-slot');
  if (exercise && slot) slot.innerHTML = progressionHtml(exercise);
}
function setFields(set, index) {
  return `<div class="set-row" data-set="${index}"><div class="set-row-heading"><span>SET ${index + 1}</span><button class="link-button" type="button" data-action="remove-set" aria-label="Remove set ${index + 1}">Remove</button></div><label>Amount<input type="number" min="0" max="9999" step="1" inputmode="numeric" data-set-field="value" value="${esc(set.value)}" placeholder="e.g. 10"></label><label>Unit<select data-set-field="unit"><option value="reps"${selected(set.unit, 'reps')}>Reps</option><option value="seconds"${selected(set.unit, 'seconds')}>Seconds</option></select></label><label>Weight (kg)<input type="number" min="0" max="1000" step="0.5" inputmode="decimal" data-set-field="weight" value="${esc(set.weight)}" placeholder="Optional"></label><label>Band resistance<input type="text" maxlength="200" data-set-field="band" value="${esc(set.band)}" placeholder="Optional"></label><label>Reps left in reserve<input type="number" min="0" max="10" step="1" inputmode="numeric" data-set-field="rir" value="${esc(set.rir)}" placeholder="0–10"></label></div>`;
}
function renderCardio() {
  const durations = cardioForWeek(state.week), easy = isEasyWeek(state.week);
  $('cardio-cards').innerHTML = ['bike', 'treadmill'].map(kind => {
    const log = state.cardio[`${state.week}:${kind}`] || blankCardio();
    const bike = kind === 'bike';
    return `<article class="cardio-card" data-cardio="${kind}"><div class="cardio-icon" aria-hidden="true">${bike ? '↻' : '↗'}</div><span class="micro-label">${bike ? 'MONDAY · CYCLE' : 'FRIDAY · WALK'}</span><h3>${bike ? 'Easy does it on the bike.' : 'Find your stride.'}</h3><p>${bike ? 'Pedal smoothly at a conversational pace. Build duration before intensity.' : 'Walk at a comfortable pace. Start flat; incline is optional, not a goal.'} ${easy ? 'Keep the effort easy this week.' : ''}</p><span class="cardio-dose">${durations[kind]} MINUTES · A FLEXIBLE GUIDE</span><details><summary>Log this session + move the date</summary><div class="cardio-fields"><label class="done-label"><input type="checkbox" data-cardio-field="done"${checked(log.done)}> Completed</label><label>Date<input type="date" data-cardio-field="date" value="${esc(log.date || defaultDate(state.startDate, state.week, kind))}"></label><label>Minutes<input type="number" min="0" max="999" inputmode="numeric" data-cardio-field="minutes" value="${esc(log.minutes)}"></label><label>Effort (RPE 1–10)<input type="number" min="1" max="10" inputmode="numeric" data-cardio-field="rpe" value="${esc(log.rpe)}"></label>${bike ? `<label>Bike resistance (optional)<input type="text" maxlength="200" data-cardio-field="resistance" value="${esc(log.resistance)}"></label><label>Cadence (optional)<input type="number" min="0" max="300" inputmode="numeric" data-cardio-field="cadence" value="${esc(log.cadence)}"></label>` : `<label>Speed (km/h, optional)<input type="number" min="0" max="100" step="0.1" inputmode="decimal" data-cardio-field="speed" value="${esc(log.speed)}"></label><label>Incline (%, optional)<input type="number" min="0" max="100" step="0.5" inputmode="decimal" data-cardio-field="incline" value="${esc(log.incline)}"></label>`}<label class="wide-field">Notes<textarea rows="2" maxlength="2000" data-cardio-field="notes">${esc(log.notes)}</textarea></label></div></details></article>`;
  }).join('');
}
function renderMobility() {
  $('mobility-list').innerHTML = mobility.map(([en, pt, dose, why], i) => `<article class="mobility-card"><span class="number">${String(i + 1).padStart(2, '0')} /</span><h3>${esc(en)}</h3><p lang="pt-BR">${esc(pt)}</p><p class="duration">${esc(dose)}</p><p>${esc(why)}</p></article>`).join('');
}
function renderProgress() {
  let sessions = 0;
  for (let week = 1; week <= 52; week++) sessions += completedWeek(week);
  const movements = Object.values(state.done).filter(Boolean).length;
  const minutes = Object.values(state.cardio).filter(log => log.done).reduce((total, log) => total + (Number.isFinite(Number(log.minutes)) && Number(log.minutes) > 0 ? Number(log.minutes) : 0), 0);
  const start = Math.max(1, state.week - 7);
  const weeks = Array.from({ length: state.week - start + 1 }, (_, i) => start + i);
  const chartLabel = weeks.map(week => `week ${week}, ${completedWeek(week)} of 3`).join('; ');
  const bars = weeks.map(week => `<div class="history-column"><span class="history-bar"><i style="height:${completedWeek(week) / 3 * 100}%"></i></span><small>${week}</small></div>`).join('');
  let legacy = '';
  if (state.legacyBackup && Object.keys(state.legacyBackup.logs).length) {
    const primitive = value => ['string', 'number', 'boolean'].includes(typeof value) ? String(value) : '';
    const rows = Object.entries(state.legacyBackup.logs).filter(([week]) => /^\d{1,2}$/.test(week) && Number(week) >= 1 && Number(week) <= 52).map(([week, log]) => {
      const values = log && typeof log === 'object' ? [primitive(log.weight) && `Weight: ${primitive(log.weight)} kg`, primitive(log.squats) && `Squats: ${primitive(log.squats)}`, primitive(log.pushups) && `Push-ups: ${primitive(log.pushups)}`, primitive(log.cardioMinutes) && `Cardio: ${primitive(log.cardioMinutes)} min`, primitive(log.notes)].filter(Boolean).join(' · ') : primitive(log);
      return `<li><strong>Week ${esc(week)}</strong>: ${esc(values)}</li>`;
    }).join('');
    legacy = `<details class="legacy-checkins"><summary>Original Home Fitness 52 check-ins</summary><p>These original weekly notes are preserved as check-ins, not individual exercise sets.</p><ul>${rows}</ul></details>`;
  }
  $('progress-summary').innerHTML = `<div class="progress-stats"><div class="progress-stat"><strong>${sessions}</strong><span>strength sessions completed</span></div><div class="progress-stat"><strong>${movements}</strong><span>movements ticked</span></div><div class="progress-stat"><strong>${Math.round(minutes * 10) / 10}</strong><span>cardio minutes logged</span></div></div><p class="fineprint">A strength session counts when all six movements are ticked. Skipped movements aren't counted as completed; a partial session still matters.</p><div class="history"><div><strong>Recent strength sessions</strong><p>Completed sessions per programme week · up to 3</p></div><div class="history-chart" role="img" aria-label="Completed strength sessions: ${chartLabel}">${bars}</div></div>${legacy}`;
}
function render() { renderSetup(); renderOverview(); renderSchedule(); renderWorkout(); renderCardio(); renderProgress(); storageMessage(); }

function paintTimer() {
  const remaining = timerDeadline === null ? timerRemaining : Math.max(0, timerDeadline - Date.now());
  if (timerDeadline !== null && remaining === 0) {
    clearInterval(timerInterval); timerInterval = null; timerDeadline = null; timerRemaining = 0;
    announce('Rest timer complete. Start your next set when you feel ready.');
  }
  const seconds = Math.ceil(remaining / 1000);
  $('timer-display').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  $('timer-toggle').textContent = timerDeadline === null ? 'Start rest' : 'Pause';
}
function resetTimer() {
  clearInterval(timerInterval); timerInterval = null; timerDeadline = null;
  timerRemaining = state.settings.restSeconds * 1000;
  paintTimer();
}

for (const day of DAYS) {
  const input = $(`preferred-${day}`);
  WEEKDAYS.forEach((name, index) => input.add(new Option(name, String(index))));
  input.addEventListener('change', event => {
    const frozen = setPreferredDay(state, day, Number(event.target.value));
    persist(); render();
    announce(`Workout ${day} is usually on ${usualDay(day)}.${frozen ? ' Existing logged session dates were kept.' : ''}`);
  });
}
$('sets-goal').addEventListener('change', event => {
  state.settings.sets = event.target.value;
  persist(); renderSetup(); renderWorkout();
  announce('Set goal updated. Introductory and easy weeks stay at no more than two sets.');
});
$('rest-duration').addEventListener('change', event => {
  state.settings.restSeconds = Number(event.target.value);
  persist(); resetTimer(); announce('Rest timer duration updated and reset.');
});
$('timer-toggle').addEventListener('click', () => {
  if (timerDeadline !== null) {
    timerRemaining = Math.max(0, timerDeadline - Date.now());
    clearInterval(timerInterval); timerInterval = null; timerDeadline = null;
    paintTimer(); announce('Rest timer paused.');
  } else {
    if (timerRemaining <= 0) timerRemaining = state.settings.restSeconds * 1000;
    timerDeadline = Date.now() + timerRemaining;
    timerInterval = setInterval(paintTimer, 250);
    paintTimer(); announce('Rest timer started.');
  }
});
$('timer-reset').addEventListener('click', () => { resetTimer(); announce('Rest timer reset.'); });
document.addEventListener('visibilitychange', paintTimer);

for (let week = 1; week <= 52; week++) $('week-select').add(new Option(`Week ${week} · ${phases[phaseIndex(week)].title}`, String(week)));
$('week-select').addEventListener('change', event => setWeek(Number(event.target.value)));
$('start-date').addEventListener('change', event => { state.startDate = event.target.value; persist(); render(); announce('Start date updated.'); });
$('current-week').addEventListener('click', () => {
  if (!state.startDate) { $('start-date').closest('details').open = true; $('start-date').focus(); announce('Set a start date first to find your current week.'); return; }
  setWeek(weekForDate(state.startDate));
});
document.addEventListener('click', event => {
  const tab = event.target.closest('[data-select-day]');
  if (tab) { setDay(tab.dataset.selectDay, !!tab.closest('#schedule')); return; }
  const button = event.target.closest('[data-action]');
  if (!button || button.tagName !== 'BUTTON') return;
  const card = button.closest('[data-exercise]');
  if (!card) return;
  const exercise = workouts[phaseIndex(state.week)][state.day].find(item => item.id === card.dataset.exercise);
  const log = exerciseLog(sessionKey(state.week, state.day, exercise.id));
  if (button.dataset.action === 'add-set' || button.dataset.action === 'repeat-set') {
    if (log.sets.length >= 30) { announce('A maximum of 30 sets can be recorded for one movement.'); return; }
    const previous = log.sets.at(-1);
    log.sets.push(button.dataset.action === 'repeat-set' && previous ? { ...previous } : { value: '', unit: doseTarget(exercise.dose)?.unit || 'reps', weight: '', band: '', rir: '' });
  } else if (button.dataset.action === 'remove-set') log.sets.splice(Number(button.closest('[data-set]').dataset.set), 1);
  else return;
  openExercises.add(exercise.id);
  const action = button.dataset.action;
  persist(); renderWorkout();
  const updated = $('exercise-list').querySelector(`[data-exercise="${exercise.id}"]`);
  const focusTarget = action === 'remove-set' ? updated.querySelector('[data-action="add-set"]') : updated.querySelector('[data-set]:last-child [data-set-field="value"]');
  focusTarget?.focus({ preventScroll: true });
  announce('Set log updated.');
});
// Capture because the native details toggle event does not bubble.
$('exercise-list').addEventListener('toggle', event => {
  if (!event.target.matches('[data-details]')) return;
  if (event.target.open) openExercises.add(event.target.dataset.details); else openExercises.delete(event.target.dataset.details);
}, true);
$('session-summary').addEventListener('change', event => {
  if (event.target.id !== 'session-date') return;
  state.scheduled[`${state.week}:${state.day}`] = event.target.value;
  persist(); renderSchedule(); announce('Session date updated.');
});
function updateExercise(event) {
  const input = event.target, card = input.closest('[data-exercise]');
  if (!card) return;
  const key = sessionKey(state.week, state.day, card.dataset.exercise);
  if (input.dataset.action === 'done') {
    state.done[key] = input.checked;
    if (input.checked && state.exerciseLogs[key]) { state.exerciseLogs[key].skipped = false; const skipped = card.querySelector('[data-log-field="skipped"]'); if (skipped) skipped.checked = false; }
    card.classList.toggle('completed', input.checked);
    persist(); renderOverview(); renderSchedule(); renderProgress(); refreshProgression(card);
    const summary = $('session-summary').querySelector('p');
    if (summary) summary.textContent = sessionDescription();
    return;
  }
  if (input.hasAttribute('data-variation-preset')) {
    if (!input.value) return;
    const log = state.exerciseLogs[key] || blankExerciseLog();
    if ((log.sets.length || state.done[key]) && log.variation !== input.value && !window.confirm('Changing this variation also changes the label on your existing sets for this movement. Continue?')) {
      input.value = log.substituted ? log.variation : '';
      return;
    }
    state.exerciseLogs[key] = log;
    log.variation = input.value; log.substituted = true;
    card.querySelector('[data-log-field="variation"]').value = log.variation;
    card.querySelector('[data-log-field="substituted"]').checked = true;
    syncSubstitutionUI(card, log); persist(); refreshProgression(card);
    announce('Alternative recorded. The original rep range may not apply.');
    return;
  }
  if (input.dataset.logField) {
    const log = exerciseLog(key);
    log[input.dataset.logField] = input.type === 'checkbox' ? input.checked : input.value;
    if (input.dataset.logField === 'skipped' && input.checked) {
      state.done[key] = false; card.querySelector('[data-action="done"]').checked = false; card.classList.remove('completed');
      renderOverview(); renderSchedule(); renderProgress();
      const summary = $('session-summary').querySelector('p');
      if (summary) summary.textContent = sessionDescription();
    }
    syncSubstitutionUI(card, log); persist(); refreshProgression(card); return;
  }
  if (input.dataset.setField) {
    const log = exerciseLog(key), row = input.closest('[data-set]');
    if (log.sets[Number(row.dataset.set)]) log.sets[Number(row.dataset.set)][input.dataset.setField] = input.value;
    persist(); refreshProgression(card);
  }
}
function syncSubstitutionUI(card, log) {
  const tag = card.querySelector('.variation-tag');
  tag.hidden = !(log.substituted && log.variation);
  tag.textContent = log.substituted && log.variation ? `Your alternative: ${log.variation}` : '';
  card.querySelector('.substitution-note').hidden = !log.substituted;
  const preset = card.querySelector('[data-variation-preset]');
  preset.value = log.substituted && [...preset.options].some(option => option.value === log.variation) ? log.variation : '';
}
$('exercise-list').addEventListener('input', event => { if (event.target.type !== 'checkbox' && event.target.tagName !== 'SELECT') updateExercise(event); });
$('exercise-list').addEventListener('change', event => { if (event.target.type === 'checkbox' || event.target.tagName === 'SELECT') updateExercise(event); });
function updateCardio(event) {
  const input = event.target, card = input.closest('[data-cardio]');
  if (!card || !input.dataset.cardioField) return;
  const log = cardioLog(card.dataset.cardio);
  log[input.dataset.cardioField] = input.type === 'checkbox' ? input.checked : input.value;
  persist(); renderSchedule(); renderProgress();
}
$('cardio-cards').addEventListener('input', event => { if (event.target.type !== 'checkbox') updateCardio(event); });
$('cardio-cards').addEventListener('change', event => { if (event.target.type === 'checkbox') updateCardio(event); });

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('export-json').addEventListener('click', () => {
  try { download('everyday-strong-backup.json', JSON.stringify(makeBackup(state), null, 2), 'application/json'); announce('Backup downloaded.'); }
  catch { announce('Could not create a backup. Please check your entries.'); }
});
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
$('export-csv').addEventListener('click', () => {
  const rows = [['type', 'week', 'session', 'date', 'exercise', 'completed', 'skipped', 'substituted', 'variation', 'set', 'amount', 'unit', 'weight_kg', 'band', 'rir', 'discomfort', 'minutes', 'effort_rpe', 'speed_kmh', 'incline_percent', 'bike_resistance', 'cadence', 'notes']];
  for (let week = 1; week <= 52; week++) for (const day of DAYS) for (const exercise of workouts[phaseIndex(week)][day]) {
    const key = sessionKey(week, day, exercise.id), log = state.exerciseLogs[key] || blankExerciseLog();
    if (!state.done[key] && !state.exerciseLogs[key]) continue;
    for (const [index, set] of (log.sets.length ? log.sets : [null]).entries()) rows.push(['strength', week, day, scheduledDate(week, day), exercise.en, !!state.done[key], log.skipped, log.substituted, log.variation, set ? index + 1 : '', set?.value, set?.unit, set?.weight, set?.band, set?.rir, log.discomfort, '', '', '', '', '', '', log.notes]);
  }
  for (const [key, log] of Object.entries(state.cardio)) {
    const [week, kind] = key.split(':');
    rows.push(['cardio', week, kind, log.date || defaultDate(state.startDate, Number(week), kind), '', log.done, '', '', '', '', '', '', '', '', '', '', log.minutes, log.rpe, log.speed, log.incline, log.resistance, log.cadence, log.notes]);
  }
  download('everyday-strong-progress.csv', rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  announce('CSV exported.');
});
$('import-json').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > MAX_BACKUP_SIZE) throw new Error('The backup is larger than 5 MB.');
    const imported = readBackup(await file.text());
    if (!window.confirm('Restore this backup? It will replace the current Everyday Strong data in this browser. Download a backup first if you want to keep it.')) return;
    state = imported; persistent = true; openExercises = new Set(); resetTimer(); persist(); render();
    announce(persistent ? 'Backup restored.' : 'Backup opened for this session, but browser storage is unavailable. Download it again before leaving.');
  } catch (error) { window.alert(`Could not restore backup: ${error.message}`); }
  finally { event.target.value = ''; }
});

renderMobility();
if (loaded.migrated) persist();
render();
paintTimer();
$('app').setAttribute('aria-busy', 'false');
