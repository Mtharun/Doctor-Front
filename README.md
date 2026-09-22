# Doctor-front

Patient-facing and admin web app for the DentalCare clinic: public
marketing site, patient portal (booking, appointments, emergency requests,
reports), and an admin dashboard. React 19 + Vite + Tailwind CSS v4 +
react-router v7, talking to the `Doctor-back` API over plain `fetch`.

## Requirements

- Node.js 20+ (built and tested on Node 22).
- A running instance of `Doctor-back` (see its README) to talk to.

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_URL to your backend's URL
npm run dev              # starts the dev server on http://localhost:5173
```

## Environment variables

Copy `.env.example` to `.env`. Never commit `.env`.

| Variable | Meaning |
|---|---|
| `VITE_API_URL` | Base URL of the `Doctor-back` API, no trailing slash (e.g. `http://localhost:5000` for local dev, or your deployed API's URL in production). |

Because Vite only exposes env vars prefixed `VITE_` to the browser bundle,
this is the only variable the frontend needs or reads.

## Available scripts

- `npm run dev` - local dev server with hot reload.
- `npm run build` - production build to `dist/`.
- `npm run preview` - serve the built `dist/` locally, to sanity-check a
  production build before deploying it.
- `npm run lint` - ESLint across all `.js/.jsx/.ts/.tsx` files.

## Deploying

This builds to a static `dist/` folder and can be hosted on any static
host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, etc.):

1. Set `VITE_API_URL` in your hosting platform's environment variables to
   your deployed `Doctor-back` API's public URL (Vite bakes this in at
   *build* time, not runtime, so it must be set before/during the build).
2. Build command: `npm run build`. Output directory: `dist`.
3. **SPA routing fallback:** because this is a client-side-routed single
   page app, the host must serve `index.html` for any path it doesn't
   otherwise recognize (e.g. a direct visit to `/patient/dashboard`).
   This repo already includes the config both major static hosts need:
   - `vercel.json` (Vercel)
   - `public/_redirects` (Netlify)
   Other hosts (Cloudflare Pages, S3/CloudFront, nginx, etc.) each have
   their own equivalent "rewrite everything to index.html" setting - check
   your host's docs if you're not using Vercel or Netlify.
4. On the backend, set `CORS_ORIGIN` to this frontend's deployed URL so
   the API accepts requests from it (see `Doctor-back`'s README).

Deployment itself requires your own hosting account and credentials, which
is not something that can be done on your behalf - the steps above are
everything you need to do it yourself.
