import { useEffect, useState } from "react";

/** Reads verses aloud with the device's own voices: Hindi voice for Sanskrit, then the meaning. */

type Part = { text: string; lang: string };

let speakingId: string | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

function voiceFor(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase()));
}

export function speak(id: string, parts: Part[]) {
  if (!supported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  if (speakingId === id) {
    speakingId = null;
    notify();
    return;
  }
  speakingId = id;
  notify();
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p.text);
    u.lang = p.lang;
    const v = voiceFor(p.lang);
    if (v) u.voice = v;
    u.rate = p.lang.startsWith("hi") ? 0.82 : 0.95;
    if (i === parts.length - 1) {
      u.onend = u.onerror = () => {
        if (speakingId === id) {
          speakingId = null;
          notify();
        }
      };
    }
    synth.speak(u);
  });
}

export function stopSpeaking() {
  if (!supported()) return;
  window.speechSynthesis.cancel();
  speakingId = null;
  notify();
}

export function useSpeaking(id: string): boolean {
  const [on, setOn] = useState(speakingId === id);
  useEffect(() => {
    const l = () => setOn(speakingId === id);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, [id]);
  return on;
}

export const canSpeak = supported;
