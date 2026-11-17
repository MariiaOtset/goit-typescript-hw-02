# Photo Explorer — The Visual Archive

An editorial photography discovery experience for finding inspiration, exploring beautifully curated themes, saving favourite images, and discovering photographers. Built with React, TypeScript and the Unsplash API for a portfolio showcase.

## Highlights
- Immersive editorial homepage with six curated photography collections
- Responsive masonry photo gallery that preserves each image's natural aspect ratio
- Live Unsplash search with orientation and colour filters, pagination and proper empty/error states
- Saved Collection using localStorage — no login required
- Accessible fullscreen lightbox with left/right keyboard navigation, image attribution and download actions
- Credit and links to the original creators on Unsplash
- Responsive desktop, tablet and mobile layouts

## Tech stack
React 18 · TypeScript · Vite · Axios · CSS Modules · react-modal · Unsplash API

## Run
```bash
npm ci
npm run dev
npm run build
npm run lint
```

Optional: set `VITE_UNSPLASH_ACCESS_KEY` in `.env.local` to replace the browser-visible demo access key. All `VITE_` variables are public. The previous public demo key is retained for compatibility with the deployed assignment; a server-side proxy would be required to hide credentials.

Photo content and image downloads depend on the public Unsplash API, its rate limits and availability. Photos remain the property of their authors. Download interactions call the Unsplash download-tracking endpoint when supplied by the API.

## Portfolio review
This version lives on the feature branch `feat/portfolio-redesign-v1` until visual and functional QA are complete. `main` and the live site are not changed by this branch.

Made by [Mariia Otset](https://github.com/MariiaOtset).
