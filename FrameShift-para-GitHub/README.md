# FrameShift

Independent digital studio website. AI power, Human perspective.

## Local development

Run `node server.mjs` and open http://localhost:3000. No dependencies are required.
Run `npm run check` to check JavaScript syntax and `node build.mjs` to rebuild `dist/`.

## Content and interactions

- `index.html`: brand, hero, five website previews, team and contact.
- `styles.css`: responsive layout, glass navigation and preview animations.
- `script.js`: mobile navigation, carousel, hover screenshot tours and scroll reveals.
- `public/projects/*-preview.webp`: 640 px-wide full-page screenshots for the hero.
- `public/projects/*-website.webp`: 1280 px-wide full-page screenshots for the portfolio.
- `public/team/*.webp`: resized team portraits; source PNGs remain available.
- `public/frameshift-logo.webp`: transparent logo, without a background panel.
- `public/favicon.png`: 64 × 64 favicon derived from the supplied icon.

Hero previews move down once on hover or keyboard focus and remain at the bottom; leaving returns them to the top. Each direction starts after a one-second delay, then scrolls at a slow average speed of 110 px/second with easing. Interruptions cancel pending movement and resume from the current position. Mouse-click focus does not keep previews running or prevent carousel advancement. Every portfolio card is a native link, including its screenshot; wheel, touch and arrow keys scroll its preview. Reduced-motion preferences disable automatic tours.

Projects: Sacca Real Estate, Chiara & Martín, Azul Hotel & Retreat, Chen Visualization and Milo & Maple. The Milo & Maple concept remains in `milo-maple/`.

Contact cards appear in this order: WhatsApp, Calendar, phone and email. Project enquiries and hiring both use `frameshift.software@gmail.com`. Email links open Gmail compose with separate prefilled subjects and fill-in templates; nothing is sent automatically. Calendar uses `https://calendar.app.google/RdSdZzmtTGnoxMr58`.

This folder contains the current website source and the assets it uses. Upload its contents to the root of your GitHub repository. Run `node build.mjs` to generate `dist/`; Git metadata and generated build files are excluded.
