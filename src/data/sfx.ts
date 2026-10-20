export const sfxMap = {
    click: { file: "/sfx/click.mp3", volume: 0.28, duckMs: 0 },
    next: { file: "/sfx/next.mp3", volume: 0.36, duckMs: 700 },
    "gift-open": { file: "/sfx/gift-open.mp3", volume: 0.5, duckMs: 1200 },
    "balloon-pop": { file: "/sfx/balloon-pop.mp3", volume: 0.36, duckMs: 350 },
    flip: { file: "/sfx/flip.mp3", volume: 0.32, duckMs: 350 },
    sparkle: { file: "/sfx/sparkle.mp3", volume: 0.25, duckMs: 500 },
    scratch: { file: "/sfx/scratch.mp3", volume: 0.2, duckMs: 0 },
    reveal: { file: "/sfx/reveal.mp3", volume: 0.42, duckMs: 850 },
    confetti: { file: "/sfx/confetti.mp3", volume: 0.42, duckMs: 1000 },
    firework: { file: "/sfx/firework.mp3", volume: 0.5, duckMs: 1200 },
    "counter-tick": { file: "/sfx/counter-tick.mp3", volume: 0.15, duckMs: 0 },
    success: { file: "/sfx/success.mp3", volume: 0.45, duckMs: 900 },
    heart: { file: "/sfx/heart.mp3", volume: 0.32, duckMs: 550 },
    "candle-blow": { file: "/sfx/candle-blow.mp3", volume: 0.4, duckMs: 800 },
    hover: { file: "/sfx/hover.mp3", volume: 0.08, duckMs: 0 },
} as const;

export type SfxEvent = keyof typeof sfxMap;
