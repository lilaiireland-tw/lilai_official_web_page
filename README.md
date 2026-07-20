# Lilai Ireland Frontend

Next.js + TypeScript + App Router frontend for `lilaiireland.com`.

## Architecture

- Next.js owns the public frontend.
- WordPress remains the CMS origin at `WORDPRESS_ORIGIN`.
- WooCommerce cart, checkout, and account pages are rewritten to WordPress in phase 1.
- Existing SEO URLs should stay unchanged through the fallback slug route.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust values:

```bash
NEXT_PUBLIC_SITE_URL=https://lilaiireland.com
WORDPRESS_ORIGIN=https://cms.lilaiireland.com
WORDPRESS_API_BASE=https://cms.lilaiireland.com/wp-json/wp/v2
WOOCOMMERCE_STORE_API_BASE=https://cms.lilaiireland.com/wp-json/wc/store/v1
REVALIDATE_SECRET=change-me
```

## URL Preservation

Important existing URLs are listed in `src/data/urlMap.ts`.

After starting the dev server, run:

```bash
npm run check:urls
```

For a deployed preview:

```bash
$env:CHECK_BASE_URL="https://your-preview.vercel.app"
npm run check:urls
```

Every important public URL should return `2xx` or `3xx` before DNS is pointed to Vercel.

## WordPress Routing

The catch-all route `src/app/[...slug]/page.tsx`:

1. Looks for a WordPress page by slug.
2. Falls back to a WordPress post by slug.
3. Returns 404 if neither exists.
4. Generates canonical URLs on `lilaiireland.com`.

## WooCommerce Phase 1

Checkout is intentionally not rebuilt in Next.js yet.

These paths rewrite to `WORDPRESS_ORIGIN`:

- `/cart/`
- `/checkout/`
- `/my-account/`

They also receive `X-Robots-Tag: noindex, nofollow` from `next.config.ts`.

## Deployment

1. Push this project to GitHub.
2. Import the repo into Vercel.
3. Set environment variables in Vercel.
4. Test homepage, WordPress fallback URLs, `/wp-json`, `/wp-content`, cart, checkout, and my-account on Preview.
5. Only switch DNS after URL preservation and checkout tests pass.
