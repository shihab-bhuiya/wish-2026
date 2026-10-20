"use client";

import { useCallback, useEffect } from "react";
import { sfxMap, type SfxEvent } from "@/data/sfx";
import { useAudio } from "@/lib/audio-context";

const preloadFiles = new Map<SfxEvent, HTMLAudioElement>();
const activeSounds = new Set<HTMLAudioElement>();

export function preloadSfx() {
    if (typeof window === "undefined") return;
    for (const event of ["click", "next", "gift-open", "flip", "sparkle", "reveal", "confetti", "heart", "balloon-pop"] as const) {
        const audio = new Audio(sfxMap[event].file);
        audio.preload = "auto";
        preloadFiles.set(event, audio);
    }
}

export function useSfx() {
    const { started, muted, sfxEnabled, ducked, duckMusic } = useAudio();

    useEffect(() => {
        if (!muted && sfxEnabled) return;
        for (const audio of activeSounds) {
            audio.pause();
            audio.currentTime = 0;
            audio.remove();
        }
        activeSounds.clear();
    }, [muted, sfxEnabled]);

    const play = useCallback((event: SfxEvent) => {
        if (!started || muted || !sfxEnabled || typeof window === "undefined") return;
        const sound = sfxMap[event];
        const audio = event === "scratch" ? new Audio(sound.file) : (preloadFiles.get(event)?.cloneNode(true) as HTMLAudioElement | undefined) ?? new Audio(sound.file);
        audio.preload = "auto";
        audio.volume = Math.max(0, Math.min(1, sound.volume * (ducked ? 0.25 : 1) * (0.95 + Math.random() * 0.1)));
        audio.playbackRate = 0.95 + Math.random() * 0.1;
        activeSounds.add(audio);
        if (sound.duckMs) duckMusic(sound.duckMs);
        void audio.play().catch(() => { activeSounds.delete(audio); });
        audio.addEventListener("ended", () => { activeSounds.delete(audio); audio.remove(); }, { once: true });
        audio.addEventListener("error", () => { activeSounds.delete(audio); audio.remove(); }, { once: true });
    }, [duckMusic, ducked, muted, sfxEnabled, started]);

    const startScratch = useCallback(() => {
        if (!started || muted || !sfxEnabled || typeof window === "undefined") return null;
        const audio = new Audio(sfxMap.scratch.file);
        audio.loop = true;
        audio.volume = sfxMap.scratch.volume;
        activeSounds.add(audio);
        void audio.play().catch(() => { activeSounds.delete(audio); });
        return audio;
    }, [muted, sfxEnabled, started]);

    const stopScratch = useCallback((audio: HTMLAudioElement | null) => {
        if (!audio) return;
        const initialVolume = audio.volume;
        const startedAt = performance.now();
        const fade = window.setInterval(() => {
            const progress = Math.min(1, (performance.now() - startedAt) / 140);
            audio.volume = initialVolume * (1 - progress);
            if (progress >= 1) {
                window.clearInterval(fade);
                audio.pause();
                activeSounds.delete(audio);
                audio.remove();
            }
        }, 20);
    }, []);

    return { play, startScratch, stopScratch };
}
