import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { ArrowIcon } from "@/components/icons";
import { MarketingServices } from "@/components/marketing-services";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <Image
            src="/homepage-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
          {/* Replace this image with a muted autoplay video when Casey's final hero film is available. */}
        </div>
        <SiteHeader />
        <div className="hero-content shell">
          <p className="hero-kicker">Casey James · Arizona REALTOR®</p>
          <h1 id="hero-title">Most agents list homes.<br /><em>I market them.</em></h1>
          <p className="hero-copy">Combining expert real estate guidance with industry-leading photography, video, drone, 3D tours, and digital marketing to help homes stand out and sell.</p>
          <div className="hero-actions">
            <a className="button button--gold" href="#contact">Get Your Free Home Value <ArrowIcon /></a>
            <a className="button button--ghost" href="#contact">Schedule a Consultation</a>
          </div>
        </div>
        <div className="hero-footer shell">
          <span>Serving Tucson, Phoenix &amp; Southern Arizona</span>
          <a href="#meet-casey">Discover the difference <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="meet section" id="meet-casey" aria-labelledby="meet-title">
        <div className="shell meet-grid">
          <div className="portrait-shell">
            <div className="portrait-outer-frame" aria-hidden="true" />
            <div className="portrait-inner-frame">
              <Image
                src="/casey-james-headshot.png"
                alt="Casey James, Marketing-First REALTOR"
                width={912}
                height={1368}
                loading="eager"
                sizes="(max-width: 900px) 100vw, 44vw"
                className="meet-image"
              />
            </div>
          </div>
          <div className="meet-content">
            <p className="eyebrow">Meet Casey</p>
            <h2 id="meet-title">Your home deserves more than a sign in the yard.</h2>
            <p>Selling well takes more than a listing in a database and waiting for buyers to notice. Casey combines REALTOR® guidance with premium media strategy to help sellers prepare, position, and launch their homes with intention.</p>
            <p>Through his connection to <a className="inline-link" href={siteConfig.luxePartnerUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit Luxe Realty Photography">Luxe Realty Photography</a>, the visual plan starts early — not after the listing is already live — so photography, video, drone, 3D tours, and digital campaigns support one clear selling strategy.</p>
            <p>Every detail is planned to work together, from pricing and preparation to presentation, launch, and promotion.</p>
            <div className="credibility-list" aria-label="Casey James credibility points">
              <span><small>01</small>Strategic listing preparation</span>
              <span><small>02</small>Professional media from day one</span>
              <span><small>03</small>Tucson, Phoenix &amp; Southern Arizona reach</span>
            </div>
            <a className="text-link" href="#contact">Start a conversation <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="advantage section section--ivory" id="marketing">
        <div className="shell">
          <div className="advantage-intro">
            <div className="advantage-copy">
              <p className="eyebrow">The marketing advantage</p>
              <h2>Built to create attention. Designed to inspire action.</h2>
              <p>Every home has a story. The right launch gives buyers a reason to care—and a clear path to act.</p>
            </div>
            <div className="advantage-media" aria-hidden="true">
              <Image
                src="/marketing-advantage-section-photo.jpg"
                alt=""
                width={1024}
                height={683}
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
          </div>
          <div className="advantage-grid">
            <article><span>01</span><h3>Position with purpose</h3><p>Pricing, preparation, and a tailored launch plan built around your property and goals.</p></article>
            <article><span>02</span><h3>Present exceptionally</h3><p>Premium visual media that captures the home, the details, and the lifestyle buyers want.</p></article>
            <article><span>03</span><h3>Promote beyond the listing</h3><p>Digital storytelling and strategic distribution that extend reach to more qualified buyers.</p></article>
          </div>
        </div>
      </section>

      <section className="services section">
        <div className="shell">
          <div className="services-intro">
            <SectionHeading eyebrow="Marketing services" title="Every tool your home needs to stand out." description="A coordinated suite of professional media and marketing—planned as one campaign, not a collection of add-ons." />
            <div className="services-media" aria-hidden="true">
              <Image
                src="/marketing-services-section-photo.jpg"
                alt=""
                width={1100}
                height={733}
                sizes="(max-width: 1100px) 100vw, 40vw"
              />
            </div>
          </div>
          <MarketingServices />
        </div>
      </section>

      <section className="partner section">
        <div className="shell partner-grid">
          <div className="partner-visual" aria-hidden="true">
            <div className="partner-mark"><span>LUXE</span><small>Realty Photography</small></div>
          </div>
          <div className="partner-content">
            <p className="eyebrow">Powered by premium media</p>
            <h2>An inside advantage in how homes are seen.</h2>
            <p>As a co-owner of Luxe Realty Photography, Casey brings direct access to the media expertise trusted to showcase homes across Arizona.</p>
            <p>This partnership means your visual strategy is not outsourced as an afterthought. It is part of the selling plan from day one.</p>
            <a className="text-link" href={siteConfig.luxePartnerUrl} target="_blank" rel="noopener noreferrer">Meet the media partner <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="testimonials section section--ivory" aria-labelledby="testimonials-title">
        <div className="shell testimonial-layout">
          <div>
            <p className="eyebrow">Seller experience</p>
            <h2 id="testimonials-title">What sellers can expect.</h2>
            <div className="seller-photo">
              <Image
                src="/seller-experience-section-photo.jpg"
                alt="Southern Arizona home prepared for a premium real estate launch"
                width={1024}
                height={683}
                loading="eager"
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
          </div>
          <div className="seller-expectations" aria-label="Seller experience expectations">
            <article>
              <span>01</span>
              <h3>Clear communication</h3>
              <p>Know what is happening, why it matters, and what comes next before your home reaches the market.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Practical guidance</h3>
              <p>Get focused advice on preparation, presentation, pricing, and buyer-facing details that affect attention.</p>
            </article>
            <article>
              <span>03</span>
              <h3>A launch plan</h3>
              <p>Bring media, listing strategy, and digital promotion together around a coordinated market debut.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="service-area section" id="service-area">
        <div className="shell service-area-grid">
          <div>
            <p className="eyebrow">Local expertise · statewide reach</p>
            <h2>Arizona is home.<br /><em>Your move starts here.</em></h2>
          </div>
          <div className="area-list" aria-label="Service areas">
            <span>Tucson <small>01</small></span>
            <span>Phoenix <small>02</small></span>
            <span>Southern Arizona <small>03</small></span>
          </div>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="shell contact-grid">
          <div className="contact-intro">
            <p className="eyebrow">Start a conversation</p>
            <h2>What could your home be worth with the right marketing?</h2>
            <p>Request a complimentary home value conversation and a clear look at what it would take to position your property for the market.</p>
            <p className="next-step">What happens next: Casey reviews your request, follows up directly, and outlines a practical first step for your selling timeline.</p>
            <div className="contact-details">
              <span>Tucson · Phoenix · Southern Arizona</span>
              <span>Personal strategy. Premium presentation.</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid">
          <a className="brand" href="#top"><span className="brand-name">Casey <em>James</em></span><span className="brand-role">Marketing-First REALTOR®</span></a>
          <p>© {new Date().getFullYear()} Casey James. All rights reserved.</p>
          <p className="footer-disclaimer">Equal Housing Opportunity. Brokerage and license information to be added before launch.</p>
        </div>
      </footer>
    </main>
  );
}
