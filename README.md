# Bleu Ape Trading

A personal trading journal and community app for traders, built as a TripleTen final project (Stage 1  React frontend + third-party APIs).

Log trades to track profit/loss, keep an eye on your trading streak, catch a daily market-news digest and weather, plan your month with a P&L goal meter, connect with other traders, and find curated study resources and courses all in one place.

## Features

- **Dashboard** — trading streak banner with live clock, weather, and location; running P&L total; today's top market headlines (via the [Finnhub](https://finnhub.io/) API); a trading calendar with per-day notes and P&L entries
- **Trade Journal** — log trades (ticker, P&L, notes), automated stats (win rate, average win/loss, best/worst trade), a monthly P&L goal meter, and a running "Time On App" clock
- **The Nest** — a community hub: add friends, get "people you may know" suggestions based on mutual connections, send private messages (with a notification bell), and read announcements that link back to Courses
- **Resources** — a curated, editable list of programs and links worth checking out, plus your own additions
- **Courses** — course announcements and upcoming live sessions
- **Accounts** — sign up / log in, an optional recovery email, and a password-reset flow; each account can set a profile picture

## Tech stack

React 18 · Vite · React Router · CSS (BEM naming) · Finnhub API · Open-Meteo API · browser `localStorage` for persistence




## Project structure

```
src/
├── components/     # Reusable UI pieces, one folder per component (JSX + CSS)
├── pages/          # Route-level components (Dashboard, Journal, Nest, Resources, Courses)
├── utils/          # localStorage persistence + business logic (trades, auth, community,
│                   # messages, announcements, calendar notes, monthly goal, session time)
├── images/         # Static images
└── vendor/         # Third-party assets (e.g. fonts)
```

## Known limitations (Stage 1 scope)

This is a frontend-only app for Stage 1 — there's no server or database yet. Accounts, trades, friends, and messages all live in the browser's `localStorage`, which means features like friends and messaging only work between accounts created in the same browser. A real backend (accounts, security, and data shared across devices) is planned for the optional Stage 2/3.

## Roadmap (optional Stages 2 & 3)

- Real backend (Express + MongoDB): user auth, trades and messages saved server-side instead of `localStorage`
- Real-time notifications instead of local polling
- Owner-only analytics dashboard

## Link to my Trello Acc

https://trello.com/invite/b/6a8e30132e2ae4c8673f9cb1/ATTI92e4b9e9ce48d74d652a34ceacfcef5dA54E77FB/bleu-ape-trading-app

## Project Pitch Video
https://www.loom.com/share/35b474b08e894131bf98c9e0c1e7bdf5


## Deployed Project
https://laurita130.github.io/bleu-ape-trading/
