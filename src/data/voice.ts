export const LETTER_VOICE_LANG: "en" | "ur" = "en";

import { experienceCopy, letter, urduBirthdayWish } from "@/data/content";

export const voiceTracks = {
  urduWish: { file: "/voice/urdu-wish.mp3", language: "ur", subtitle: urduBirthdayWish, volume: 1 },
  letterEn: { file: "/voice/letter-en.mp3", language: "en", subtitle: letter, volume: 0.95 },
  letterUr: { file: "/voice/letter-ur.mp3", language: "ur", subtitle: letter, volume: 0.95 },
  dontForgetMe: { file: "/voice/dont-forget-me.mp3", language: "en", subtitle: experienceCopy.promise.message, volume: 0.95 },
} as const;

export type VoiceId = keyof typeof voiceTracks;
