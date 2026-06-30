"use client";

import { CSSProperties, useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const baseOffset = 20;

function ChainLinkIcon() {
  return (
    <svg
      className="site-signature__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10.5 13.5 13.5 10.5" />
      <path d="M8.5 16.5 6.8 18.2a4 4 0 0 1-5.7-5.7l3.1-3.1a4 4 0 0 1 5.7 0" />
      <path d="M15.5 7.5 17.2 5.8a4 4 0 0 1 5.7 5.7l-3.1 3.1a4 4 0 0 1-5.7 0" />
    </svg>
  );
}

export function SiteSignature() {
  const [bottomOffset, setBottomOffset] = useState(baseOffset);

  useEffect(() => {
    let frame = 0;
    const desktopQuery = window.matchMedia("(min-width: 901px)");

    function updateSignaturePosition() {
      if (!desktopQuery.matches) {
        setBottomOffset(baseOffset);
        return;
      }

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const footer = document.getElementById("site-footer");

        if (!footer) {
          setBottomOffset(baseOffset);
          return;
        }

        const footerTop = footer.getBoundingClientRect().top;
        const overlapOffset = Math.max(baseOffset, window.innerHeight - footerTop + baseOffset);

        setBottomOffset(Math.round(overlapOffset));
      });
    }

    function handleViewportChange() {
      updateSignaturePosition();
    }

    updateSignaturePosition();
    window.addEventListener("scroll", updateSignaturePosition, { passive: true });
    window.addEventListener("resize", updateSignaturePosition);
    desktopQuery.addEventListener("change", handleViewportChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateSignaturePosition);
      window.removeEventListener("resize", updateSignaturePosition);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return (
    <a
      className="site-signature"
      href={siteConfig.treydmarkTechUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Treydmark Tech"
      style={{ "--signature-bottom": `${bottomOffset}px` } as CSSProperties}
    >
      <span className="site-signature__text">Designed by Treydmark Tech</span>
      <ChainLinkIcon />
    </a>
  );
}
