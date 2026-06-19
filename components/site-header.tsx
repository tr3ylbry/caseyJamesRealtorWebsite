import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Casey James, home">
        <span className="brand-name">Casey <em>James</em></span>
        <span className="brand-role">Marketing-First REALTOR®</span>
      </a>
      <nav aria-label="Main navigation">
        {siteConfig.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <a className="header-cta" href="#contact">Let&apos;s talk</a>
    </header>
  );
}
