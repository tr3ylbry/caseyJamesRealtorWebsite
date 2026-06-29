# Casey James — The Marketing-First REALTOR®

Phase 1 of Casey James's personal real estate website. This is a premium, single-page seller lead-generation site for homeowners in Tucson, Phoenix, and Southern Arizona.

> **Positioning:** Most agents list homes. I market them.

This project is separate from Luxe Realty Photography. Luxe appears only as Casey's featured media partner.

## Phase 1 scope

The landing page includes:

- Cinematic hero with replaceable image/video media
- Casey's personal positioning and seller-focused messaging
- Marketing advantage and services sections
- Luxe Realty Photography partner section
- Testimonials placeholder
- Arizona service areas
- Home-value and consultation calls to action
- Accessible lead-capture form interface
- Responsive mobile-first design
- SEO, Open Graph, robots, and sitemap metadata
- Desktop and mobile browser regression tests

Phase 1 intentionally excludes IDX/MLS search, listings, a blog, CRM integration, user accounts, booking, payments, and other advanced backend functionality.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- CSS without a component framework
- Playwright for browser testing
- ESLint for static analysis

Most of the page is rendered as static server content. The contact form is the only client component.

## Local development

Requirements:

- Node.js 20.9 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the current static Phase 1 implementation.

## Available commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
npm run test:e2e  # Run desktop and mobile Playwright tests
```

Install Playwright's Chromium browser before the first browser-test run:

```bash
npx playwright install chromium
```

If the development server is using a port other than `3000`, provide its URL explicitly:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

## Project structure

```text
app/
  layout.tsx             Global metadata, fonts, and document layout
  page.tsx               Single-page landing-site composition and copy
  globals.css            Design system and responsive styles
  robots.ts              Search crawler configuration
  sitemap.ts             XML sitemap configuration
components/
  contact-form.tsx       Client-side form UI and validation state
  icons.tsx              Local SVG marketing icons
  marketing-services.tsx Service-card content and layout
  section-heading.tsx    Reusable section heading
  site-header.tsx        Brand header and navigation
lib/
  site.ts                Shared site identity, URL, areas, and navigation
public/
  hero/
    homepage-hero.jpg
  icons/
    arrow.svg
    camera.svg
    chart.svg
    drone.svg
    equal-housing.svg
    mail.svg
    phone.svg
    tour.svg
    video.svg
  logos/
    real-realty-logo-white.png
  portraits/
    casey-james-headshot.png
  section-photos/
    local-expertise-section-photo.jpg
    marketing-advantage-section-photo.jpg
    marketing-services-section-photo.jpg
    seller-experience-section-photo.jpg
tests/e2e/
  landing.spec.ts        Responsive rendering, CTA, and form tests
```

## Replacing launch content

The current site is structured so final brand assets can be added without redesigning the page.

### Site identity and domain

Update `lib/site.ts` with the confirmed production domain, service areas, and navigation. The current canonical URL is `https://sellwithcaseyjames.com` and must be verified before deployment.

### Copy and page sections

Core page copy and section ordering are in `app/page.tsx`.

### Hero image or video

The current hero image is `public/hero/homepage-hero.jpg`.

To change the hero image, replace that file or update the `Image` source in `app/page.tsx`. To use video, replace the hero media element with a muted, looping, `playsInline` video and retain a poster image and readable gradient overlay.

### Casey's portrait and logo

Add approved assets under `public/` and reference them from `app/page.tsx` or `components/site-header.tsx`. Do not embed oversized originals; export appropriately sized WebP, AVIF, PNG, or SVG assets.

### Luxe partner link

The partner CTA currently points to the temporary Luxe Southern Arizona reference deployment. Replace it with the approved production Luxe URL before launch.

### Testimonials

Replace the placeholder blockquote in `app/page.tsx` with verified client testimonials. Obtain permission before publishing names, photos, or transaction details.

## Contact form status

The Phase 1 form provides accessible fields, browser validation, consent language, and a completed interaction state. It does **not** currently transmit or store lead data.

Before launch, connect it to an approved delivery service or server endpoint. The production implementation should include:

- Server-side validation and normalization
- Spam and abuse protection
- Rate limiting
- Secure environment variables
- Clear success and failure states
- Privacy-policy and consent review
- Logging that excludes unnecessary personal information

Do not ship the current demonstration success state as a live lead-delivery workflow.

## SEO and launch configuration

SEO metadata is defined in `app/layout.tsx`; crawler and sitemap routes are generated by `app/robots.ts` and `app/sitemap.ts`.

Before launch, confirm:

- Production domain and canonical URL
- Page title and description
- Social sharing image
- REALTOR® and Fair Housing usage
- Brokerage name, license information, and required disclosures
- Casey's contact information
- Privacy policy and terms, if required
- Analytics and cookie-consent requirements
- Final Luxe partner URL

## Verification

The current Phase 1 implementation has been verified with:

- Successful production build
- Successful ESLint run
- Desktop and mobile Playwright coverage
- CTA-to-form interaction coverage
- Form validation and completion-state coverage
- Horizontal overflow checks
- Production dependency audit with no known vulnerabilities at the time of verification

Run the full local verification sequence before opening a pull request or deploying:

```bash
npm run lint
npm run build
npm run test:e2e
npm audit --omit=dev
```
