# Nike Clone 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Public Nike-clone 3D shopping site, static build, GitHub Pages.
**Architecture:** Vite + React + TS SPA; cart via context + localStorage; procedural three.js hero; no router (modal detail).
**Tech Stack:** vite, react, typescript, three, @react-three/fiber, @react-three/drei
**Spec:** docs/superpowers/specs/2026-11-14-nike-clone-3d-design.md

## Global Constraints
- `base: '/nike-clone-3d/'` in vite.config.ts; repo name must equal `nike-clone-3d`
- Static only; no server code, no external runtime fonts/CDN
- Reduced-motion (matchMedia `prefers-reduced-motion`) gates rotation, float, parallax
- Cart persists in localStorage key `nike-clone-cart`
- Footer: "Not affiliated with Nike, Inc." disclaimer
- Deploy via GitHub Actions → actions/deploy-pages; Pages source set via `gh api` BEFORE push
- Bundle target < 500KB gzip; keep drei minimal

See git history for the full task breakdown (6 tasks, SDD mode, all tasks reviewed clean).
