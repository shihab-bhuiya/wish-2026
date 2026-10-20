import { voiceTracks, type VoiceId } from "@/data/voice";

export function createVoice(id: string) {
  const track = voiceTracks[id as VoiceId];
  if (!track) return null;
  const audio = new Audio(track.file);
  audio.preload = "auto";
  audio.volume = track.volume;
  return audio;
}

export function preloadVoices() {
  Object.values(voiceTracks).forEach(({ file }) => {
    const audio = new Audio(file);
    audio.preload = "auto";
    audio.load();
  });
}
