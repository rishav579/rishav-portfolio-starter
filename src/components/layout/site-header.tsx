"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site header — register-aware fixed navigation (PROVENANCE, Phase 3;
 * Phase 11A: scroll-spy tick + section numbers).
 *
 * Same weightless DOM as the approved header: a wordmark and four mono index
 * links, 44px targets, identical keyboard behavior. Register awareness —
 * the fixed header sits outside both section registers, so while its band
 * overlaps the Paper Archive (measured from the threshold's lower edge to
 * the end of the Correspondence section) it re-inks via data-register="paper".
 *
 * Phase 11A additions, both inside the SAME rAF-throttled listener (one
 * scroll listener total, no new libraries):
 * - scroll-spy: the nav link for the section currently under the header
 *   gets a 2px accent tick and aria-current. Without JS no tick renders
 *   (state stays null) — the header simply remains its correct dark self.
 * - section numbers on the nav links (01/03/05/06), hidden below sm so the
 *   320px fit is untouched. Numbers mirror the section kickers.
 *
 * Anchor targets:
 * - #index   → hero (this page)
 * - #library → Engineering Library section (this page)
 * - #about   → the Archivist section (Phase 3)
 * - #contact → the Correspondence section (Phase 3)
 */
const NAV_LINKS = [
  { href: "#index", id: "index", num: "01", label: "Index" },
  { href: "#library", id: "library", num: "03", label: "Library" },
  { href: "#about", id: "about", num: "05", label: "About" },
  { href: "#contact", id: "contact", num: "06", label: "Contact" },
] as const;

type HeaderRegister = "dark" | "paper";

export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [register, setRegister] = useState<HeaderRegister>("dark");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = document.getElementById("archive-threshold");
      const contact = document.getElementById("contact");
      if (!threshold || !contact) {
        setRegister("dark");
      } else {
        const headerBottom =
          window.scrollY + (ref.current?.offsetHeight ?? 64);
        const paperStart =
          threshold.getBoundingClientRect().bottom + window.scrollY;
        const paperEnd =
          contact.getBoundingClientRect().bottom + window.scrollY;
        setRegister(
          headerBottom >= paperStart && headerBottom <= paperEnd
            ? "paper"
            : "dark",
        );
      }

      // Scroll-spy: the LAST nav section whose top has passed the header's
      // lower edge is active. #practice sits between Library and About and
      // is not a nav target, so it simply extends Library's range.
      const mark = window.scrollY + (ref.current?.offsetHeight ?? 64) + 8;
      let current: string | null = null;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mark) {
          current = link.id;
        }
      }
      setActiveId(current);
    };

    // rAF-throttled; initial run is also scheduled (not synchronous) so the
    // effect body itself never sets state.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-register={register}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Legibility veils — one per register, crossfaded on register change */}
      <div
        aria-hidden="true"
        className="header-veil header-veil-dark pointer-events-none absolute inset-x-0 top-0 h-24"
      />
      <div
        aria-hidden="true"
        className="header-veil header-veil-paper pointer-events-none absolute inset-x-0 top-0 h-24"
      />

      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6"
      >
        <a
          href="#index"
          className="inline-flex min-h-[44px] items-center whitespace-nowrap text-[13px] font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-accent-cyan sm:text-[15px]"
        >
          RISHAV RAJ
        </a>

        <ul className="flex items-center gap-0 sm:gap-1">
          {NAV_LINKS.map((link) => {
            const active = activeId === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className="relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded-sm px-1.5 font-mono text-[10px] uppercase tracking-[0.05em] text-muted-foreground transition-colors duration-200 hover:text-foreground sm:px-3 sm:tracking-[0.22em]"
                >
                  {/* section number — hidden below sm to protect the 320px fit */}
                  <span
                    aria-hidden="true"
                    className={`mr-0 hidden text-[9px] tracking-[0.1em] transition-colors duration-200 sm:mr-1.5 sm:inline ${
                      active
                        ? "text-accent-cyan"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {link.num}
                  </span>
                  {link.label}
                  {/* scroll-spy tick (Phase 11A) — decorative underline;
                      without JS it never renders (state stays null) */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-1.5 bottom-1 h-0.5 bg-accent-cyan transition-opacity duration-200 sm:inset-x-3 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
