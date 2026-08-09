"use client";

// Web Audio API Synthesizer for zero-latency, lightweight UI sound feedback
let audioCtx: AudioContext | null = null;
let isUnlocked = false;

function initAudioUnlock() {
  if (typeof window === "undefined" || isUnlocked) return;
  const unlock = () => {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    isUnlocked = true;
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

if (typeof window !== "undefined") {
  initAudioUnlock();
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("fintrack_sound_enabled");
  return val === null ? true : val === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("fintrack_sound_enabled", enabled ? "true" : "false");
}

/**
 * Play a crisp, pleasant Instagram/YouTube style micro-haptic touch pop sound.
 */
export function playClickSound(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary Instagram/YouTube micro-pop (Sine wave 880Hz -> 240Hz in 35ms)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);

    // Tactile thud thump (Triangle wave 160Hz -> 60Hz) for authentic haptic feel
    const oscThud = ctx.createOscillator();
    const gainThud = ctx.createGain();
    oscThud.type = "triangle";
    oscThud.frequency.setValueAtTime(160, now);
    oscThud.frequency.exponentialRampToValueAtTime(60, now + 0.025);

    gainThud.gain.setValueAtTime(0.045, now);
    gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

    oscThud.connect(gainThud);
    gainThud.connect(ctx.destination);

    oscThud.start(now);
    oscThud.stop(now + 0.03);
  } catch (e) {
    // Ignore audio errors gracefully
  }
}

/**
 * Play a gentle 150ms two-tone success chime for CRUD operations.
 */
export function playSuccessSound(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // First Note (E5 - 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.05, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second Note (G5 - 783Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.06);
    gain2.gain.setValueAtTime(0.06, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.16);
  } catch (e) {
    // Ignore audio errors gracefully
  }
}

