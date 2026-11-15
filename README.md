# NIKE Clone 3D

A Nike clone storefront built as a portfolio and practice project — a procedural 3D sneaker experience engineered in code.

> Not affiliated with Nike, Inc. This is a demo/practice clone built for learning and portfolio work.

## What it is

A pixel-faithful-feeling, code-first recreation of the Nike shopping experience: hero with a procedural 3D sneaker, product grid, editorial story band, newsletter and footer — all styled with a custom ink + volt design system.

It is a practice project. No real Nike assets, no real products, no real sales.

## Stack

- React 19 + TypeScript + Vite
- three.js via @react-three/fiber + @react-three/drei (procedural 3D sneaker)
- Custom CSS design system (tokens in `src/styles/global.css`)
- Vitest + react-dom/server render smoke tests

## Local development

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build   # tsc --noEmit && vite build
npm run test    # vitest run
npm run preview # vite preview
```

## Deploy

GitHub Pages deploy via GitHub Actions workflow at `.github/workflows/deploy.yml` — runs on push to `main`, installs, builds and deploys `dist`.

## Disclaimer

**All rights reserved; demo only.** This project is a portfolio/practice exercise and is not affiliated with, endorsed by, or connected to Nike, Inc. Nike and NIKE are trademarks of Nike, Inc. All product names, copy and designs shown here are part of the fictional clone.

## License

All rights reserved. Demo only — no license granted for reuse or reproduction.
