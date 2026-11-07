class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private bgmGain: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private isBgmPlaying: boolean = false;
  private currentBgmStep: number = 0;

  constructor() {
    // Initialized on interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.muted ? 0 : 0.05, this.ctx.currentTime);
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (this.ctx && this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // ================= BGM SYSTEM =================
  // Cheerful, gentle retro 8-bit chiptune loop
  public startBgm() {
    this.initCtx();
    if (!this.ctx) return;
    this.isBgmPlaying = true;
    this.currentBgmStep = 0;

    if (this.bgmIntervalId) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }

    // 16-step happy nursery melody (C major pentatonic / cheerful arcade)
    const melody = [
      523.25, 0,      659.25, 0,      783.99, 880.00, 783.99, 0,
      659.25, 523.25, 587.33, 659.25, 523.25, 0,      0,      0,
      587.33, 0,      659.25, 0,      783.99, 0,      880.00, 0,
      1046.50,880.00, 783.99, 659.25, 523.25, 0,      0,      0
    ];

    const bass = [
      261.63, 261.63, 329.63, 329.63, 392.00, 392.00, 329.63, 329.63,
      261.63, 261.63, 293.66, 293.66, 261.63, 261.63, 261.63, 261.63,
      293.66, 293.66, 329.63, 329.63, 392.00, 392.00, 440.00, 440.00,
      523.25, 440.00, 392.00, 329.63, 261.63, 261.63, 261.63, 261.63
    ];

    const stepDuration = 180; // ms per step (approx 83 bpm 16th-notes)

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const now = this.ctx.currentTime;
      const step = this.currentBgmStep % melody.length;
      const noteFreq = melody[step];
      const bassFreq = bass[step];

      // Play melody note
      if (noteFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.16);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.17);
      }

      // Play soft bass note every 2 steps
      if (step % 2 === 0 && bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassG = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq / 2, now);

        bassG.gain.setValueAtTime(0.06, now);
        bassG.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

        bassOsc.connect(bassG);
        bassG.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.32);
      }

      this.currentBgmStep++;
    };

    tick();
    this.bgmIntervalId = window.setInterval(tick, stepDuration);
  }

  public pauseBgm() {
    this.isBgmPlaying = false;
  }

  public resumeBgm() {
    if (!this.isBgmPlaying && this.bgmIntervalId) {
      this.isBgmPlaying = true;
    } else if (!this.bgmIntervalId) {
      this.startBgm();
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // ================= SOUND EFFECTS =================
  // 1. UI Tap / Button Click
  public playTap() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 2. Avatar Selection "뾰롱!"
  public playSelect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    playTone(523.25, now, 0.08); // C5
    playTone(783.99, now + 0.07, 0.12); // G5
    playTone(1046.50, now + 0.15, 0.2); // C6
  }

  // 3. Fishing Line Cast & Whoosh
  public playCast() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // 4. Correct Catch Fanfare (8-bit celebration)
  public playCorrect() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.10 }, // C5
      { f: 659.25, d: 0.10 }, // E5
      { f: 783.99, d: 0.10 }, // G5
      { f: 1046.50, d: 0.25 }, // C6
      { f: 1318.51, d: 0.35 }  // E6
    ];

    let t = now;
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + n.d);
      t += n.d * 0.85;
    });
  }

  // 5. Wrong Answer (Gentle Boing / Wobble)
  public playWrong() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.12);
    osc.frequency.linearRampToValueAtTime(180, now + 0.22);
    osc.frequency.linearRampToValueAtTime(110, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // 6. Water Splash
  public playSplash() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 7. Time Out / Game Over Horn
  public playTimeUp() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [
      { f: 440, t: now, d: 0.18 },
      { f: 440, t: now + 0.2, d: 0.18 },
      { f: 330, t: now + 0.4, d: 0.4 }
    ].forEach((tone) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(tone.f, tone.t);
      gain.gain.setValueAtTime(0.15, tone.t);
      gain.gain.exponentialRampToValueAtTime(0.01, tone.t + tone.d);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(tone.t);
      osc.stop(tone.t + tone.d);
    });
  }

  // 8. Aquarium 200 fish milestone triumph fanfare
  public playTrophyFanfare() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C
      { f: 523.25, d: 0.12 }, // C
      { f: 523.25, d: 0.12 }, // C
      { f: 659.25, d: 0.35 }, // E
      { f: 587.33, d: 0.15 }, // D
      { f: 659.25, d: 0.15 }, // E
      { f: 783.99, d: 0.45 }, // G
      { f: 1046.50, d: 0.80 } // High C
    ];

    let t = now;
    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + note.d);
      t += note.d * 0.9;
    });
  }

  // 9. Korean TTS Speech Synthesis: Pronounces clean word (e.g. "사과")
  public speakWord(word: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // Natural, clear cadence for 4-year-olds
      utterance.pitch = 1.2; // Cheerful, gentle pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio fallback available
    }
  }

  // 10. Korean TTS Speech Synthesis: Pronounces guided phrases (e.g. "'무', 다시 찾아보자")
  public speakPhrase(phrase: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio fallback available
    }
  }
}

export const sounds = new SoundEngine();
