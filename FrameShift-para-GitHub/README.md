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

The hero previews tour down and back up on hover or keyboard focus, with a 1.5-second pause at the top. Movement accelerates and decelerates over short 180 ms ramps around a 325 px/second cruise speed. On departure, the preview brakes, pauses for 250 ms and returns smoothly. Mouse-click focus does not keep previews running or prevent carousel advancement. Every portfolio card is a native link, including its screenshot; wheel, touch and arrow keys scroll its preview. Reduced-motion preferences disable automatic tours.

Projects: Sacca Real Estate, Chiara & Martín, Azul Hotel & Retreat, Chen Visualization and Milo & Maple. The Milo & Maple concept remains in `milo-maple/`.

Contact cards appear in this order: WhatsApp, Calendar, phone and email. The contact address `hello@frameshift.studio` and hiring address `careers@frameshift.studio` are provisional text only; no mailbox has been created or verified. No messages are sent or meetings booked automatically.

This folder contains the current website source and the assets it uses. Upload its contents to the root of your GitHub repository. Run `node build.mjs` to generate `dist/`; Git metadata and generated build files are excluded.
