"use client";

import { createContext, useContext } from "react";

export interface AudioControls {
    started: boolean;
    muted: boolean;
    sfxEnabled: boolean;
    voiceEnabled: boolean;
    ducked: boolean;
    voiceDurationMs: number;
    playVoice: (id: string) => Promise<boolean>;
    stopVoice: () => void;
    pauseVoice: () => void;
    resumeVoice: () => Promise<void>;
    playBirthdaySong: () => void;
    setChapter: (chapter: number) => void;
    startAudio: () => Promise<void>;
    toggleMute: () => void;
    toggleSfx: () => void;
    duckMusic: (durationMs: number) => void;
}

export const AudioContext = createContext<AudioControls | null>(null);

export function useAudio() {
    const value = useContext(AudioContext);
    if (!value) throw new Error("useAudio must be used within AudioProvider.");
    return value;
}

export function useVoice() {
    const value = useAudio();
    return { enabled: value.voiceEnabled, play: value.playVoice, stop: value.stopVoice, pause: value.pauseVoice, resume: value.resumeVoice };
}
