# Photo assets

Place additional photo files here. Next.js static image imports must be registered explicitly in `src/assets/gallery.ts`; add a matching `photoSources` key and use that ID from `photoMap` in `src/data/content.ts`.

The eight photos already present in the parent `src/assets/` folder are kept in use. `AniPhoto` includes a blurred static-image preview and a graceful SVG fallback if an image fails to load.
