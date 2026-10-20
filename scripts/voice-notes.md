# Voice recording scripts

Record each passage in a warm, natural male voice. Export mono MP3 at 64–96 kbps and place the files in `public/voice/`.

## `urdu-wish.mp3` — Urdu birthday wish

سالگرہ مبارک ہو، آنی! تمہاری زندگی خوشیوں، کامیابیوں اور خوبصورت لمحوں سے بھری رہے۔ تمہارا ہر خواب پورا ہو، ڈھاکہ یونیورسٹی بھی اور جاپان بھی۔ ہمیشہ مسکراتی رہو۔

## `letter-en.mp3` — A Letter From Shihab

Read the complete `letter` text in `src/data/content.ts`, including its natural paragraph pauses.

## `dont-forget-me.mp3` — One Little Request

Read the sentence in `experienceCopy.promise.message` from `src/data/content.ts`.

## Optional `letter-ur.mp3`

Use this filename if you translate the letter to Urdu and set `LETTER_VOICE_LANG` to `"ur"` in `src/data/voice.ts`.

For generated speech, a TTS service can use Azure's Urdu male voice `ur-PK-AsadNeural` and English male voice `en-US-GuyNeural`, or a service such as ElevenLabs. Listen through once before export to check names and pacing.
