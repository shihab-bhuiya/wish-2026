"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AudioContext as AudioStateContext } from "@/lib/audio-context";
import { musicTracks } from "@/data/music";
import { sfxMap, type SfxEvent } from "@/data/sfx";
import { preloadSfx, useSfx } from "@/lib/sfx";
import { createVoice, preloadVoices } from "@/lib/voice";

const birthdayNotes = [
  392, 392, 440, 392, 523.25, 493.88,
  392, 392, 440, 392, 587.33, 523.25,
  392, 392, 783.99, 659.25, 523.25, 493.88, 440,
  698.46, 698.46, 659.25, 523.25, 587.33, 523.25,
];
const ambientNotes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 261.63, 329.63, 392, 493.88];

function startSynth(context: globalThis.AudioContext) {
  const master = context.createGain();
  master.gain.value = 0.055;
  master.connect(context.destination);
  const birthdayGain = context.createGain();
  birthdayGain.gain.value = 0;
  birthdayGain.connect(context.destination);

  const pad = context.createOscillator();
  const padGain = context.createGain();
  pad.type = "sine";
  pad.frequency.value = 130.81;
  padGain.gain.value = 0.12;
  pad.connect(padGain).connect(master);
  pad.start();

  let noteIndex = 0;
  const playNote = (frequency: number, duration = 0.75, volume = 0.2, output: GainNode = master) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(volume, now + 0.08);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(envelope).connect(output);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  };

  const timer = window.setInterval(() => {
    playNote(ambientNotes[noteIndex % ambientNotes.length]);
    noteIndex += 1;
  }, 900);

  let birthdayTimer: number | null = null;
  return {
    master,
    playBirthday: () => {
      if (birthdayTimer !== null) window.clearInterval(birthdayTimer);
      birthdayGain.gain.setTargetAtTime(0.24, context.currentTime, 0.04);
      let index = 0;
      birthdayTimer = window.setInterval(() => {
        const note = birthdayNotes[index];
        playNote(note, index === 5 || index === 11 ? 0.95 : 0.55, 0.38, birthdayGain);
        index += 1;
        if (index >= birthdayNotes.length && birthdayTimer !== null) {
          window.clearInterval(birthdayTimer);
          birthdayTimer = null;
          birthdayGain.gain.setTargetAtTime(0, context.currentTime, 0.2);
        }
      }, 570);
    },
    stopBirthday: () => {
      if (birthdayTimer !== null) window.clearInterval(birthdayTimer);
      birthdayTimer = null;
      birthdayGain.gain.setTargetAtTime(0, context.currentTime, 0.04);
    },
    stop: () => {
      window.clearInterval(timer);
      if (birthdayTimer !== null) window.clearInterval(birthdayTimer);
      pad.stop();
      birthdayGain.disconnect();
      master.disconnect();
    },
  };
}

function SfxListener() {
  const { play } = useSfx();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>("button, a, [data-sfx]");
      if (!element) return;
      const requested = element.dataset.sfx as SfxEvent | undefined;
      play(requested && requested in sfxMap ? requested : "click");
    };
    const handleHover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-sfx-hover]");
      if (element) play("hover");
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("pointerover", handleHover);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("pointerover", handleHover);
    };
  }, [play]);

  return null;
}

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(() =>
    typeof window === "undefined" || window.localStorage.getItem("birthday-sfx-enabled") !== "false",
  );
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try { return typeof window === "undefined" || window.localStorage.getItem("birthday-voice-enabled") !== "false"; }
    catch { return true; }
  });
  const [chapter, setChapter] = useState(0);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [ducked, setDucked] = useState(false);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const contextRef = useRef<globalThis.AudioContext | null>(null);
  const synthRef = useRef<ReturnType<typeof startSynth> | null>(null);
  const activeTrackRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const retryTrackRef = useRef<HTMLAudioElement | null>(null);
  const trackSourceRef = useRef("");
  const duckTimerRef = useRef<number | null>(null);
  const rippleId = useRef(0);

  const startAudio = useCallback(async () => {
    setStarted(true);
    setMusicBlocked(false);
    try {
      const ContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (ContextConstructor && !contextRef.current) {
        contextRef.current = new ContextConstructor();
        synthRef.current = startSynth(contextRef.current);
      }
      await contextRef.current?.resume();
      preloadSfx();
      preloadVoices();
      const retryTrack = activeTrackRef.current ?? retryTrackRef.current;
      if (retryTrack) {
        await retryTrack.play();
        activeTrackRef.current = retryTrack;
        retryTrackRef.current = null;
        setMusicBlocked(false);
      }
    } catch {
      setMusicBlocked(true);
    }
  }, []);

  const stopVoice = useCallback(() => {
    if (duckTimerRef.current) window.clearTimeout(duckTimerRef.current);
    voiceRef.current?.pause();
    if (voiceRef.current) { voiceRef.current.currentTime = 0; voiceRef.current = null; }
    setVoiceDurationMs(0);
    setDucked(false);
  }, []);
  const toggleMute = useCallback(() => {
    if (!muted) { stopVoice(); synthRef.current?.stopBirthday(); }
    setMuted(!muted);
  }, [muted, stopVoice]);
  const toggleSfx = useCallback(() => {
    const next = !sfxEnabled;
    if (!next) stopVoice();
    try {
      localStorage.setItem("birthday-sfx-enabled", String(next));
    } catch {
      // Effects can still be toggled for this visit when storage is blocked.
    }
    setSfxEnabled(next);
  }, [sfxEnabled, stopVoice]);
  const playVoice = useCallback(async (id: string) => {
    if (!voiceEnabled || muted || !sfxEnabled) return false;
    stopVoice();
    if (duckTimerRef.current) window.clearTimeout(duckTimerRef.current);
    const audio = createVoice(id);
    if (!audio) return false;
    setVoiceDurationMs(0);
    audio.addEventListener("loadedmetadata", () => setVoiceDurationMs(Number.isFinite(audio.duration) ? audio.duration * 1000 : 0), { once: true });
    voiceRef.current = audio;
    setDucked(true);
    audio.addEventListener("ended", () => { if (voiceRef.current === audio) { voiceRef.current = null; setDucked(false); } }, { once: true });
    audio.addEventListener("error", () => { if (voiceRef.current === audio) { voiceRef.current = null; setDucked(false); } }, { once: true });
    try { await audio.play(); return true; } catch { if (voiceRef.current === audio) { voiceRef.current = null; setDucked(false); } return false; }
  }, [muted, sfxEnabled, stopVoice, voiceEnabled]);
  const pauseVoice = useCallback(() => { voiceRef.current?.pause(); setDucked(false); }, []);
  const resumeVoice = useCallback(async () => { if (voiceRef.current && !muted && sfxEnabled && voiceEnabled) { try { await voiceRef.current.play(); setDucked(true); } catch { /* The page can offer its tap-to-play control. */ } } }, [muted, sfxEnabled, voiceEnabled]);
  const toggleVoice = useCallback(() => {
    const next = !voiceEnabled;
    try { localStorage.setItem("birthday-voice-enabled", String(next)); } catch { /* Keep the choice for this visit. */ }
    setVoiceEnabled(next);
    if (!next) stopVoice();
  }, [stopVoice, voiceEnabled]);

  const duckMusic = useCallback((durationMs: number) => {
    setDucked(true);
    if (duckTimerRef.current) window.clearTimeout(duckTimerRef.current);
    duckTimerRef.current = window.setTimeout(() => setDucked(false), durationMs) as unknown as number;
  }, []);

  const playBirthdaySong = useCallback(() => {
    if (!started || muted || !synthRef.current) return;
    synthRef.current.playBirthday();
    duckMusic(birthdayNotes.length * 570);
  }, [duckMusic, muted, started]);

  useEffect(() => {
    if (started && chapter === 15) playBirthdaySong();
  }, [chapter, playBirthdaySong, started]);

  useEffect(() => {
    if (!started || muted) {
      activeTrackRef.current?.pause();
      retryTrackRef.current?.pause();
      if (synthRef.current && contextRef.current) synthRef.current.master.gain.setTargetAtTime(0, contextRef.current.currentTime, 0.08);
      return;
    }

    const chapterKey = `chapter-${chapter + 1}` as keyof typeof musicTracks;
    const source = musicTracks[chapterKey] ?? musicTracks["chapter-16"];
    if (trackSourceRef.current === source && activeTrackRef.current && !activeTrackRef.current.paused) return;

    let cancelled = false;
    const previous = activeTrackRef.current;
    const next = new Audio(source);
    retryTrackRef.current = next;
    next.loop = true;
    next.preload = "auto";
    next.volume = 0;
    next.addEventListener("error", () => {
      if (!cancelled) setMusicBlocked(true);
      next.pause();
    }, { once: true });
    next.addEventListener("playing", () => {
      if (cancelled) return;
      setMusicBlocked(false);
      activeTrackRef.current = next;
      retryTrackRef.current = null;
      trackSourceRef.current = source;
      const start = performance.now();
      const target = 0.25;
      const fade = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / 1000);
        next.volume = target * progress;
        if (previous) previous.volume = Math.max(0, previous.volume * (1 - progress));
        if (synthRef.current && contextRef.current) synthRef.current.master.gain.setTargetAtTime(0.008, contextRef.current.currentTime, 0.25);
        if (progress >= 1) {
          window.clearInterval(fade);
          previous?.pause();
          previous?.removeAttribute("src");
          previous?.load();
        }
      }, 40);
    }, { once: true });
    next.addEventListener("pause", () => {
      if (!cancelled && started && !muted && !next.ended) setMusicBlocked(true);
    });
    void next.play().catch(() => {
      if (!cancelled) setMusicBlocked(true);
    });

    return () => {
      cancelled = true;
      if (next !== activeTrackRef.current) next.pause();
      if (retryTrackRef.current === next) retryTrackRef.current = null;
    };
  }, [chapter, muted, started]);

  useEffect(() => {
    if (!started || muted || !musicBlocked) return;
    const retry = window.setInterval(() => {
      const retryTrack = activeTrackRef.current ?? retryTrackRef.current;
      if (!retryTrack) return;
      void retryTrack.play().then(() => {
        activeTrackRef.current = retryTrack;
        retryTrackRef.current = null;
        setMusicBlocked(false);
      }).catch(() => setMusicBlocked(true));
    }, 2200);
    return () => window.clearInterval(retry);
  }, [musicBlocked, muted, started]);

  useEffect(() => {
    if (!started || !contextRef.current || !synthRef.current) return;
    const gain = synthRef.current.master.gain;
    const target = muted ? 0 : musicBlocked ? (ducked ? 0.01 : 0.055) : ducked ? 0.003 : 0.015;
    gain.setTargetAtTime(target, contextRef.current.currentTime, 0.12);
  }, [ducked, musicBlocked, muted, started]);

  useEffect(() => {
    const active = activeTrackRef.current;
    if (!active) return;
    const startVolume = active.volume;
    const targetVolume = muted ? 0 : ducked ? 0.045 : 0.25;
    const startedAt = performance.now();
    const ramp = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / 180);
      active.volume = startVolume + (targetVolume - startVolume) * progress;
      if (progress >= 1) window.clearInterval(ramp);
    }, 20);
    return () => window.clearInterval(ramp);
  }, [ducked, muted]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible") { stopVoice(); return; }
      if (document.visibilityState !== "visible" || !started || muted) return;
      void contextRef.current?.resume();
      if (activeTrackRef.current) void activeTrackRef.current.play().then(() => setMusicBlocked(false)).catch(() => setMusicBlocked(true));
      else setMusicBlocked(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [muted, started, stopVoice]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      const id = ++rippleId.current;
      setRipples((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => setRipples((current) => current.filter((ripple) => ripple.id !== id)), 800);
      if ("vibrate" in navigator) navigator.vibrate(10);
    };
    document.addEventListener("pointerdown", handlePointer, { passive: true });
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, []);

  useEffect(() => () => {
    activeTrackRef.current?.pause();
    synthRef.current?.stop();
    if (duckTimerRef.current) window.clearTimeout(duckTimerRef.current);
  }, []);

  const value = useMemo(() => ({ started, muted, sfxEnabled, voiceEnabled, ducked, voiceDurationMs, playVoice, stopVoice, pauseVoice, resumeVoice, playBirthdaySong, setChapter, startAudio, toggleMute, toggleSfx, toggleVoice, duckMusic }), [started, muted, sfxEnabled, voiceEnabled, ducked, voiceDurationMs, playVoice, stopVoice, pauseVoice, resumeVoice, playBirthdaySong, setChapter, startAudio, toggleMute, toggleSfx, toggleVoice, duckMusic]);

  return (
    <AudioStateContext.Provider value={value}>
      <SfxListener />
      {children}
      {ripples.map((ripple) => <span key={ripple.id} className="tap-sparkle" style={{ left: ripple.x, top: ripple.y }}>✦</span>)}
      {started && <div className="audio-dock" aria-label="Audio controls">
        <button className="audio-dock-button" onClick={toggleMute} aria-label={muted ? "Unmute music, narration and sound effects" : "Mute music, narration and sound effects"}>{muted ? "♫̸" : "♫"}<span>{muted ? "Unmute" : "Music"}</span></button>
        <button className={`audio-dock-button ${sfxEnabled ? "audio-enabled" : ""}`} onClick={toggleSfx} aria-label={sfxEnabled ? "Turn sound effects off" : "Turn sound effects on"}>✧<span>SFX {sfxEnabled ? "On" : "Off"}</span></button>
        <button className={`audio-dock-button ${voiceEnabled ? "audio-enabled" : ""}`} onClick={toggleVoice} aria-label={voiceEnabled ? "Turn narration off" : "Turn narration on"}>◖<span>Voice {voiceEnabled ? "On" : "Off"}</span></button>
      </div>}
      {started && musicBlocked && !muted && <button className="restore-music" onClick={() => void startAudio()}>Tap to restore music</button>}
      {!started && <div className="audio-gate"><div className="audio-gate-card"><span className="audio-gate-note">♫</span><p>A little music makes the magic better.</p><button onClick={() => void startAudio()}>Tap to begin 🎶</button><small>Your surprise is waiting underneath.</small></div></div>}
    </AudioStateContext.Provider>
  );
}
