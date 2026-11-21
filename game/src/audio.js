// Tiny WebAudio sound effects for Twin Lantern Hunt: no audio files,
// every blip is synthesised so the game stays fully offline.
let audioContext = null;

function getContext() {
  if (!audioContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) audioContext = new Ctor();
  }
  if (audioContext && audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone(freq, startOffset, duration, type, volume) {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + startOffset;
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + duration);
}

export function playFoundSound() { playTone(660, 0, 0.14, "sine", 0.18); playTone(880, 0.09, 0.18, "sine", 0.18); }
export function playWrongSound() { playTone(160, 0, 0.2, "sawtooth", 0.08); }
export function playHintSound() { playTone(520, 0, 0.12, "triangle", 0.14); playTone(780, 0.1, 0.14, "triangle", 0.14); }
export function playWinSound() { [523, 659, 784, 1046].forEach((f, i) => playTone(f, i * 0.11, 0.22, "sine", 0.16)); }
