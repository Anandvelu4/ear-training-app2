
/* Common functions: play pure-tone sine waves and intervals. */
function createOscillator(freq, duration=0.8, when=0) {
  if(!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const ctx = window.audioCtx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01 + when);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + when);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + duration + 0.05);
  return {osc, gain};
}

function playNote(freq, duration=0.8, when=0) {
  createOscillator(freq, duration, when);
}

function playInterval(rootFreq, intervalSemitones, gap=0.15) {
  playNote(rootFreq, 0.8, 0);
  const ratio = Math.pow(2, intervalSemitones/12);
  playNote(rootFreq * ratio, 0.8, gap);
}

/* Utils for localStorage */
function saveNotes(day, text) {
  localStorage.setItem('day_notes_' + day, text);
  alert('Notes saved');
}
function loadNotes(day) {
  return localStorage.getItem('day_notes_' + day) || '';
}
function markComplete(day) {
  localStorage.setItem('day_done_' + day, '1');
  alert('Marked complete');
  if(document.getElementById('progressBar')) updateProgress();
}
function isComplete(day) {
  return localStorage.getItem('day_done_' + day) === '1';
}

/* Progress update function (used on index) */
function updateProgress() {
  const total = 30;
  let done = 0;
  for(let i=1;i<=total;i++){
    if(localStorage.getItem('day_done_' + i) === '1') done++;
  }
  const pct = Math.round((done/total)*100);
  const bar = document.getElementById('progressBar');
  if(bar) bar.style.width = pct + '%';
  const label = document.getElementById('progressLabel');
  if(label) label.textContent = done + '/' + total + ' days';
}
