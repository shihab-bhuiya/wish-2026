# Birthday surprise deployment

## Required external assets

The project has eight statically imported photos in `src/assets/images/` already. They are registered in `src/assets/gallery.ts`, and `photoMap` in `src/data/content.ts` assigns one across every chapter, including the lock. Add future images with descriptive names such as `memory-09.jpg`, register their imports in `src/assets/gallery.ts`, and point a chapter entry in `photoMap` at the matching ID. Imported images use `next/image` blur placeholders and fall back to `public/photos/photo-fallback.svg` if an image cannot load.

Add these royalty-free/licensed music files to `public/music/`:

- `birthday.mp3`
- `dream.mp3`
- `soft-wishes.mp3`
- `letter.mp3`
- `happy-birthday.mp3`

Add the SFX listed in `public/sfx/README.md` under `public/sfx/`. Keep each file under about 50 KB when practical. Search Pixabay Sound Effects or Mixkit; verify the license and attribution terms for the individual download. The site has an original Web Audio ambient fallback and a synthesized birthday melody if music files are missing; SFX failures are silent.

## Environment variables

Copy `.env.example` to `.env` locally, replace every `replace-with-...` value, and add the same values in Vercel Project Settings → Environment Variables:

- `UNLOCK_AT=2026-10-21T00:00:00+06:00`
- `PREVIEW_SECRET` — long random secret; preview uses `/?preview=YOUR_SECRET` and is never shown in page text.
- `NEXT_PUBLIC_SITE_URL` — final HTTPS Vercel URL, with no trailing slash.
- `MONGODB_URI` — MongoDB Atlas connection URI. Allow the Vercel deployment to connect in Atlas Network Access.

`.env` is gitignored; do not commit real credentials. The checked-in `.env` contains placeholders only.

## GitHub and Vercel

1. Commit and push the project to GitHub.
2. In Vercel, choose **Add New → Project**, import the GitHub repository, and keep the detected Next.js defaults.
3. Add every environment variable above to the Vercel project. Set Production and Preview values deliberately; production must have a unique `PREVIEW_SECRET`.
4. Deploy (or redeploy after editing variables). Confirm the deployed root shows the lock before unlock.

## Safe timing test

For a staging/preview deployment, temporarily set `UNLOCK_AT` to an ISO timestamp a few minutes ahead, redeploy, and schedule that preview URL with its own QStash token/secret and test subscription. Verify the live countdown and automatic reveal. Cancel the test message afterward. Do not change the production unlock time to test. The real event instant is `2026-10-20T18:00:00Z` = `2026-10-21 00:00:00` in Asia/Dhaka.

For local UI testing, set a private local `PREVIEW_SECRET` in `.env` and visit `/?preview=that-value`; the secret is compared server-side, and the bypass value `true` is not accepted.

## Pre-send checklist

- [ ] Deployed root is locked before midnight; the later chapters are not rendered in the locked HTML.
- [ ] Countdown agrees with a trusted Asia/Dhaka clock and `/api/time` server timestamp.
- [ ] Bell subscription works on Android Chrome and on iPhone Safari from an installed Home Screen web app.
- [ ] Music gate works on the lock page and audio continues between chapters; all track files are present.
- [ ] SFX files load for the mapped interactions; missing files do not break the experience.
- [ ] Music mute also mutes SFX; the separate SFX preference persists after reload.
- [ ] Preview works only with the server-side secret; `?preview=true` does not bypass the lock.
- [ ] Calendar `.ics` reminder has the intended Dhaka midnight instant and correct site URL.
- [ ] `npm run lint` and `npm run build` pass after final assets and environment setup.
