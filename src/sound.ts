import { SOUNDS, type SoundName } from "./sounds";
import { getSettings } from "./store";

/** Short UI sounds through Web Audio. Ambient: respects the silent switch and never stops the user's music. */
let ctx: AudioContext | null = null;
const buffers = new Map<SoundName, Promise<AudioBuffer>>();
const VOLUME: Record<SoundName, number> = { tap: 0.35, select: 0.5, correct: 0.6, wrong: 0.4, bell: 0.7, complete: 0.65 };

function context() {
  if (!ctx) {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = "ambient";
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function load(name: SoundName) {
  let buffer = buffers.get(name);
  if (!buffer) {
    const bytes = Uint8Array.from(atob(SOUNDS[name].split(",")[1]), (c) => c.charCodeAt(0));
    buffer = context().decodeAudioData(bytes.buffer);
    buffers.set(name, buffer);
  }
  return buffer;
}

export function playSound(name: SoundName) {
  if (!getSettings().sounds) return;
  try {
    const ac = context();
    load(name)
      .then((buffer) => {
        const source = ac.createBufferSource();
        const gain = ac.createGain();
        gain.gain.value = VOLUME[name];
        source.buffer = buffer;
        source.connect(gain).connect(ac.destination);
        source.start();
      })
      .catch(() => {});
  } catch {
    // Web Audio unavailable: stay silent.
  }
}
