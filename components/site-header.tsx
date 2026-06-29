"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 32);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <a className="brand" href="#top" aria-label="Casey James, home">
          <span className="brand-name">Casey <em>James</em></span>
          <span className="brand-role">Marketing-First REALTOR®</span>
        </a>
        <nav aria-label="Main navigation">
          {siteConfig.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="#contact">Let&apos;s talk</a>
      </div>
    </header>
  );
}
