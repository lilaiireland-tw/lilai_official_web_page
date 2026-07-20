# Route Preservation Plan

Generated: 2026-07-20

Primary rule: do not change public URLs. The same `https://lilaiireland.com/...` paths must continue to resolve after the Next.js migration.

## Target Ownership Model

| Route group | Owner | Data source | Why |
|---|---|---|---|
| `/` | Next.js | Static/custom homepage | Current new frontend homepage should be the public first impression. |
| Marketing/content pages | Next.js | Static components or WP REST pages | Preserve URL while improving frontend control. |
| SEO posts | Next.js | WP REST posts | Preserve article URLs and editorial workflow. |
| Category archives | Next.js | WP REST categories + posts | Preserve indexed category archive URLs. |
| Tag archives | Next.js or noindex strategy | WP REST tags + posts | Public routes exist, but they are not in sitemap. Decide before launch. |
| `/shop/` | WordPress proxy in phase 1 | WooCommerce | Store API currently returns no products. |
| `/cart/`, `/checkout/`, `/my-account/` | WordPress proxy | WooCommerce | Sessions, accounts, orders, downloads, and ECPay should not be rebuilt first. |
| `/wp-json/*` | WordPress proxy | WordPress REST API | Required for content fetching and future preview/revalidation. |
| `/wp-content/*` | WordPress proxy | WordPress uploads | Required so old image/media URLs do not break. |
| `/wp-admin/*` | WordPress origin | WordPress admin | Not a public frontend experience. |

## Next.js Route Map

| Public URL pattern | Next.js route | Handling |
|---|---|---|
| `/` | `src/app/page.tsx` | Render custom Next.js homepage. |
| `/about/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. Can later become a static custom page. |
| `/consult/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. Preserve because it is in sitemap. |
| `/ireland-study-consultation/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. |
| `/ireland-study-planning/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. |
| `/recommended-ireland-language-schools/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. Later should become a custom school-listing page. |
| `/agreement/` | `src/app/[...slug]/page.tsx` initially | Fetch WP page by slug. Legal copy can remain CMS-managed. |
| `/{post-slug}/` | `src/app/[...slug]/page.tsx` | Fetch WP page first, then WP post. This preserves flat article URLs. |
| `/category/{category-slug}/` | `src/app/category/[slug]/page.tsx` | Render archive listing from WP posts filtered by category. Needs implementation. |
| `/tag/{tag-slug}/` | `src/app/tag/[slug]/page.tsx` | Render archive or intentionally noindex/redirect. Needs SEO decision. |
| `/product/{slug}/` | `src/app/product/[slug]/page.tsx` | Already scaffolded, but no public products were returned. Keep non-critical until API returns products. |
| `/shop/` | `next.config.ts` rewrite | Proxy to WordPress in phase 1. |
| `/cart/:path*` | `next.config.ts` rewrite | Proxy to WordPress and keep noindex. |
| `/checkout/:path*` | `next.config.ts` rewrite | Proxy to WordPress and keep noindex. |
| `/my-account/:path*` | `next.config.ts` rewrite | Proxy to WordPress and keep noindex. |
| `/wp-json/:path*` | `next.config.ts` rewrite | Proxy to WordPress. |
| `/wp-content/:path*` | `next.config.ts` rewrite | Proxy to WordPress uploads. |
| `/wp-admin/:path*` | `next.config.ts` rewrite or redirect | Send to WordPress origin. |

## Data Connection Plan

### 1. Pages

Use:

```txt
GET /wp-json/wp/v2/pages?slug={slug}&_embed=1
```

Implementation:

- Keep the existing catch-all route.
- Query pages first.
- Render `title.rendered` and `content.rendered`.
- Generate metadata from Rank Math/Yoast fields when exposed, otherwise fallback to title/excerpt.
- Canonical must be `https://lilaiireland.com/{slug}/`.

Priority page slugs:

```txt
about
consult
ireland-study-consultation
ireland-study-planning
recommended-ireland-language-schools
agreement
```

### 2. Posts

Use:

```txt
GET /wp-json/wp/v2/posts?slug={slug}&_embed=1
```

Implementation:

- Keep flat URLs: `/{post-slug}/`, not `/blog/{slug}/`.
- Use page-first then post fallback to avoid conflicts.
- Render featured image from `_embedded["wp:featuredmedia"][0]`.
- Preserve canonical exactly.
- Include post URLs in Next sitemap.

Current high-priority post slugs:

```txt
dublin-renting-guide-taiwan
ireland-study-agent-questions
ireland-study-city-guide
ireland-bank-account-ppsn-tax-guide
```

Special audit slugs:

```txt
__trashed-8
__trashed-9
```

These must not be accidentally dropped. Confirm whether they are real published articles with wrong slugs, draft/trashed artifacts, or URLs that should receive 301 redirects.

### 3. Categories

Use:

```txt
GET /wp-json/wp/v2/categories?slug={slug}
GET /wp-json/wp/v2/posts?categories={categoryId}&_embed=1
```

Implementation to add:

```txt
src/app/category/[slug]/page.tsx
```

Behavior:

- `/category/ireland-study-abroad-info/` should render a post archive.
- `/category/life-in-ireland/` has zero posts and is not in sitemap. Either render empty archive with noindex or return 404 only after confirming it is not indexed/linked.

### 4. Tags

Use:

```txt
GET /wp-json/wp/v2/tags?slug={slug}
GET /wp-json/wp/v2/posts?tags={tagId}&_embed=1
```

Implementation option:

```txt
src/app/tag/[slug]/page.tsx
```

SEO recommendation:

- Do not include tag archives in sitemap yet.
- Do not 404 all tag URLs blindly because 43 non-empty tag archive URLs are public through the REST API.
- Safer phase 1 behavior: render tag archive pages with `noindex, follow`.
- After checking Google Search Console, either keep selected high-value tags indexable or redirect/noindex low-value tags.

### 5. Media

Use:

```txt
/wp-content/uploads/*
```

Implementation:

- Keep `next.config.ts` rewrite for `/wp-content/:path*`.
- Do not migrate all WP uploads into the Next.js repo.
- Keep homepage-owned custom assets in `public/assets`.
- Keep article/media uploads in WordPress.

### 6. WooCommerce

Use:

```txt
GET /wp-json/wc/store/v1/products
```

Current finding:

```txt
[]
```

Plan:

- Do not rebuild checkout, cart, account, orders, downloads, or payment flow in phase 1.
- Proxy `/shop/`, `/cart/`, `/checkout/`, `/my-account/` to WordPress.
- Keep `X-Robots-Tag: noindex, nofollow` for cart/checkout/my-account.
- Revisit custom product rendering only after the Store API returns public product objects.

## Sitemap Plan

Next.js should generate one canonical sitemap:

Include:

- `/`
- public marketing pages
- public legal page
- WP posts
- indexable category archives
- future public products if Store API exposes products

Exclude:

- `/cart/`
- `/checkout/`
- `/my-account/`
- `/wp-admin/*`
- `/wp-json/*`
- `/wp-content/uploads/*`
- tag archives until SEO decision is made
- `__trashed-*` unless confirmed as intended public URLs

Important: before DNS cutover, reconcile the current Rank Math sitemap so `/` is not duplicated and `__trashed-*` URLs are handled intentionally.

## Implementation Sequence

1. Update `src/data/urlMap.ts` from this inventory.
2. Add explicit rewrites for `/shop/:path*` in `next.config.ts`.
3. Add category archive route at `src/app/category/[slug]/page.tsx`.
4. Add tag archive route at `src/app/tag/[slug]/page.tsx` with `noindex` by default.
5. Improve `src/app/[...slug]/page.tsx` with embedded featured image, content styling, and metadata mapping.
6. Add `getPostsByCategory`, `getTagBySlug`, `getPostsByTag`, and paginated fetch helpers to `src/lib/wordpress.ts`.
7. Generate sitemap from confirmed route inventory, not raw unfiltered WP output.
8. Run `npm run build`.
9. Run URL checks against localhost and Vercel Preview.
10. Only after all important URLs return expected status should DNS be considered.

## URL Status Rules Before Launch

| URL group | Required status before DNS cutover |
|---|---|
| Homepage | `200`, rendered by Next.js |
| Pages in sitemap | `200`, same public URL |
| Posts in sitemap | `200`, same public URL |
| Category in sitemap | `200`, same public URL |
| `__trashed-*` | Explicit decision: `200`, `301`, or removed from WP sitemap before launch |
| Cart/checkout/my-account | `200/3xx`, functional through WooCommerce |
| `/wp-json/*` | `200`, proxied |
| `/wp-content/uploads/*` | `200`, proxied |
| Product pages | Do not require until Store API exposes products |
