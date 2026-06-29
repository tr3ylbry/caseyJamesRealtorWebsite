# Casey James Realtor Website — Project Context

## Project purpose

This is Casey James' personal REALTOR® landing page, not a Luxe Realty Photography company site.

The site is a premium, seller-focused, single-page brand and lead-generation website for homeowners in Tucson, Phoenix, and Southern Arizona.

Core positioning:

> Most agents list homes. I market them.

Primary audience:

- Homeowners who may want to sell
- Seller leads from business cards, brochures, and personal branding
- Tucson, Phoenix, and Southern Arizona market contacts

## Current Phase 1 scope

Implemented as a polished static frontend with one enhanced contact form.

Included:

- Single-page landing site
- Cinematic hero
- Personal Casey James positioning
- Combined Meet Casey / different-standard section
- Marketing Advantage section
- Marketing Services section
- Luxe Realty Photography partner section
- Seller Experience section
- Local Expertise / Service Area section
- Lead-capture contact form
- Basic SEO, Open Graph, robots, and sitemap metadata
- Responsive CSS
- Playwright e2e coverage

Explicitly not included in Phase 1:

- IDX / MLS search
- Property search portal
- Featured listings
- Blog
- CRM integration
- User accounts
- Booking calendar
- Payment features

## Technical stack

- Next.js App Router
- React
- TypeScript
- CSS in `app/globals.css`
- `next/image` for local public assets
- Playwright for e2e tests
- ESLint for static checks

Most of the site is server-rendered/static. The contact form is the main client-side interactive component.

## Key files

- `app/page.tsx` — page section composition and main copy
- `app/layout.tsx` — metadata, fonts, and root layout
- `app/globals.css` — visual system, section layouts, responsive rules
- `components/site-header.tsx` — header/nav
- `components/section-heading.tsx` — reusable section heading
- `components/marketing-services.tsx` — service card data and icon layout
- `components/contact-form.tsx` — custom client form validation and submission behavior
- `lib/contact-validation.ts` — shared client/server validation rules
- `app/api/contact/route.ts` — contact API endpoint, server validation, honeypot, rate limiting
- `lib/site.ts` — site config, nav, URLs, service areas, fallback email

## Current image assets

Current assets are organized by type in `public/`:

- `hero/homepage-hero.jpg` — hero background
- `portraits/casey-james-headshot.webp` — optimized Meet Casey portrait
- `portraits/casey-james-headshot.png` — original source portrait
- `section-photos/marketing-advantage-section-photo.jpg` — Marketing Advantage image
- `section-photos/marketing-services-section-photo.jpg` — Marketing Services image
- `section-photos/seller-experience-section-photo.jpg` — Seller Experience image
- `section-photos/local-expertise-section-photo.jpg` — Service Area background
- `logos/real-realty-logo-white.png` — Real Broker footer logo
- `icons/` — public SVG copies for CTA, marketing service, contact, and Equal Housing icons

## Section notes

### Hero

Uses `hero/homepage-hero.jpg` with a top dark gradient overlay so the navbar remains readable over bright architectural details.

### Meet Casey

Combines the removed "A Different Standard" positioning with Casey's personal introduction. The portrait uses a two-frame treatment only:

1. outer decorative frame
2. inner image frame

The headshot is loaded eagerly because it may be detected as LCP depending on viewport/scroll position.

### Marketing Advantage

Uses a two-column intro layout:

- left: eyebrow, headline, supporting copy
- right: `section-photos/marketing-advantage-section-photo.jpg`

The lower three-column process cards remain unchanged.

### Marketing Services

Uses a desktop intro layout with the heading/copy on the left and `section-photos/marketing-services-section-photo.jpg` on the right. The image is aligned with the top of the headline, not the eyebrow. The services shell is slightly wider on desktop so the image can be larger without squeezing the headline copy.

### Seller Experience

This section reframes the original testimonials placeholder into "What sellers can expect" content. It is designed to be converted into testimonials later.

### Service Area

Uses `section-photos/local-expertise-section-photo.jpg` as the background. The headline and location list use Service Area-specific CSS variables so both sides scale proportionally while preserving the two-column visual balance. Keep Equal Housing language and brokerage/license placeholders in footer until verified.

## Contact form behavior

The form uses custom validation instead of browser-native validation UI.

Current rules:

- First name is required
- Last name is required
- Email and phone are individually optional
- At least one valid contact method is required
- Email format is validated if provided
- Phone accepts numbers only and formats as `123-456-7890`
- Message to Casey is required
- Message must be at least 10 characters
- Consent checkbox is required

Client behavior:

- No `alert()`
- No native browser validation messages
- Inline field errors
- Form-level success/error status with `aria-live`
- Submit button disables while sending
- Friendly client-side API error mapping

Server behavior:

- Mirrors validation in `lib/contact-validation.ts`
- Honeypot support
- Simple rate limiting
- Does not expose raw server/API errors to users
- Uses `CONTACT_FORM_WEBHOOK_URL` when configured

## Config and launch placeholders

Current shared config is in `lib/site.ts`.

Before launch, confirm:

- Production canonical URL
- Final Luxe Realty Photography URL
- Brokerage name
- License information
- Required REALTOR® / Equal Housing / brokerage disclosures
- Casey's direct contact information
- Privacy policy / terms requirements
- Contact delivery endpoint or CRM workflow

Do not invent license numbers or brokerage compliance details.

## Verification commands

Run before deployment or substantial handoff:

```bash
npm run lint
npm run build
npm run test:e2e
```

If `next/font` ever fails during build because of restricted network access, rerun the production build in an environment with network access.
