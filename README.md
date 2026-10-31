This is Ani's birthday surprise built with Next.js

## Getting Started  the

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Adding narration audio

Place compressed mono MP3 files (64–96 kbps) in `public/voice/`:

- `urdu-wish.mp3` — male Urdu birthday wish
- `letter-en.mp3` — male reading of the letter
- `dont-forget-me.mp3` — short English reading of the One Little Request
- Optional later: `letter-ur.mp3` for an Urdu letter reading

Record your own voice on a phone and export MP3, or create the files with a voice service such as Azure Speech (`ur-PK-AsadNeural` and `en-US-GuyNeural`) or ElevenLabs. Full scripts and export steps are in [`scripts/voice-notes.md`](scripts/voice-notes.md). Voice file paths and language are configured in `src/data/voice.ts`; the editable Urdu text and English translation are in `src/data/content.ts`, and the letter text is the `letter` constant in that same file. Set `LETTER_VOICE_LANG` to `"ur"` in `src/data/voice.ts` to select the optional Urdu letter file.

## Pre-send checklist

- Check Urdu right-to-left rendering on Android and iPhone.
- Check that the wish voice starts after the reveal and the music ducks and recovers.
- Check that letter narration starts when the envelope opens.
- Tap Next quickly and confirm narration never overlaps.
- Check playback with the phone ringer on and media volume up.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
