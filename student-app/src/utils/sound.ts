export const playFunSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Fun, bubbly, refined "pop"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.log('Audio playback failed', e);
  }
};

export const playNormalClick = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Very quiet, subtle UI click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
};

export const playDropSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Water drop: short duration, sweeping up in frequency
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
};

export const playPageRustle = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.035, now + 0.06);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    master.connect(ctx.destination);

    // Soft filtered noise for "paper" texture.
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1800, now);
    lowpass.Q.value = 0.9;

    noise.connect(lowpass);
    lowpass.connect(master);
    noise.start(now);
    noise.stop(now + 0.42);

    // Subtle flutter tones to suggest page flipping.
    [650, 780, 540].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t + 0.08);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.012, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  } catch (e) {}
};

export const playTileRevealSound = (revealType) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.045, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    master.connect(ctx.destination);

    const beep = (freq: number, duration: number, type: OscillatorType = 'sine', at = 0, gainValue = 0.03) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + at;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(gainValue, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + duration);
    };

    switch (revealType) {
      case 'book':
        playPageRustle();
        break;
      case 'nodes':
        beep(540, 0.11, 'triangle', 0, 0.03);
        beep(760, 0.11, 'triangle', 0.07, 0.024);
        beep(980, 0.1, 'triangle', 0.14, 0.02);
        break;
      case 'ripple':
        beep(320, 0.2, 'sine', 0, 0.03);
        beep(220, 0.22, 'sine', 0.05, 0.02);
        break;
      case 'lens':
        beep(420, 0.24, 'sawtooth', 0, 0.018);
        beep(630, 0.16, 'triangle', 0.08, 0.016);
        break;
      case 'timeline':
        beep(700, 0.08, 'square', 0.02, 0.018);
        beep(700, 0.08, 'square', 0.1, 0.018);
        beep(700, 0.08, 'square', 0.18, 0.018);
        break;
      case 'circuit':
        beep(260, 0.12, 'sawtooth', 0, 0.025);
        beep(390, 0.12, 'sawtooth', 0.08, 0.022);
        beep(520, 0.14, 'triangle', 0.16, 0.02);
        break;
      default:
        beep(800, 0.08, 'triangle', 0, 0.02);
    }
  } catch (e) {}
};
