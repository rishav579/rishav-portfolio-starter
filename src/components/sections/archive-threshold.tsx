/**
 * ArchiveThreshold — the register door between the Machine Hall and the
 * Paper Archive (PROVENANCE, Phase 2B).
 *
 * Server Component. A mostly tonal, purely CSS transition:
 * Machine Hall graphite → deep charcoal → warm umber → paper. The hue drifts
 * blue-violet → warm inside the darkness so the visitor reads "changing
 * material" rather than "theme switch". No JS, no scroll behavior, no
 * scroll hijacking — static and honest by design.
 *
 * aria-hidden: the band is atmosphere (like the hero environment); the
 * doorplate line is decorative microcopy, not content.
 */
export function ArchiveThreshold() {
  return (
    // id="archive-threshold" — measurement anchor for the register-aware
    // header (Phase 3): the paper register begins at this band's lower edge.
    <div id="archive-threshold" aria-hidden="true" className="relative">
      {/* tonal descent into paper */}
      <div className="threshold-tonal h-[clamp(16rem,36svh,24rem)] w-full" />
      {/* static grain continues across the band; paper gets its own fainter grain */}
      <div className="grain-overlay absolute inset-0" />

      {/* doorplate at the paper edge */}
      <div className="animate-atmo-in pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-3">
        <span className="h-8 w-px bg-foreground/20" />
        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/45 sm:text-[10px]">
          The Archive — records, plates &amp; dossiers
        </p>
      </div>
    </div>
  );
}
