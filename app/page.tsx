import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { ArrowIcon } from "@/components/icons";
import { MarketingServices } from "@/components/marketing-services";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <Image
            src="/casey-james-hero-placeholder.png"
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
          <a href="#why-casey">Discover the difference <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="manifesto section" id="why-casey">
        <div className="shell manifesto-grid">
          <div>
            <p className="eyebrow">A different standard</p>
            <p className="manifesto-quote">Your home deserves more than a sign in the yard and a listing in a database.</p>
          </div>
          <div className="manifesto-copy">
            <p>Selling well starts before your home reaches the market. It takes clear positioning, exceptional presentation, and a campaign built around the right buyer.</p>
            <p>Casey brings real estate strategy and professional media under one focused plan—so every detail works together to make your home impossible to overlook.</p>
            <a className="text-link" href="#marketing">See the marketing approach <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="advantage section section--ivory" id="marketing">
        <div className="shell">
          <SectionHeading eyebrow="The marketing advantage" title="Built to create attention. Designed to inspire action." description="Every home has a story. The right launch gives buyers a reason to care—and a clear path to act." />
          <div className="advantage-grid">
            <article><span>01</span><h3>Position with purpose</h3><p>Pricing, preparation, and a tailored launch plan built around your property and goals.</p></article>
            <article><span>02</span><h3>Present exceptionally</h3><p>Premium visual media that captures the home, the details, and the lifestyle buyers want.</p></article>
            <article><span>03</span><h3>Promote beyond the listing</h3><p>Digital storytelling and strategic distribution that extend reach to more qualified buyers.</p></article>
          </div>
        </div>
      </section>

      <section className="services section">
        <div className="shell">
          <SectionHeading eyebrow="Marketing services" title="Every tool your home needs to stand out." description="A coordinated suite of professional media and marketing—planned as one campaign, not a collection of add-ons." />
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
            <a className="text-link" href="https://luxe-realty-photography-website.vercel.app/southern-arizona" target="_blank" rel="noreferrer">Meet the media partner <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="testimonials section section--ivory" aria-labelledby="testimonials-title">
        <div className="shell testimonial-layout">
          <div>
            <p className="eyebrow">Client experience</p>
            <h2 id="testimonials-title">Trusted guidance.<br />Marketing that delivers.</h2>
          </div>
          <blockquote>
            <p>“Client stories and verified results will be featured here as Casey&apos;s testimonial library grows.”</p>
            <footer>Testimonials coming soon</footer>
          </blockquote>
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
