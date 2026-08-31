import {
  CAPABILITIES,
  PRIMARY_DIRECTION,
  ROLE_DIRECTIONS,
  type ResolvedEvidenceRef,
} from "@/lib/practice";

/**
 * 04 / AI Engineering — the Practice Index (PROVENANCE, Phase 8).
 *
 * Server Component, paper register. Career positioning read from the record:
 * ONE primary direction (AI Engineer) rendered as the dominant statement,
 * four supporting role directions as compact ledger rows, and a capabilities
 * index — every claim carried by clickable accession references into the
 * Engineering Library (scroll + :target highlight; the dossier itself only
 * opens from the record's own Inspect action). No new motifs, no client
 * component, no images: hairlines, mono metadata, sans narrative, and the
 * room's single serif-italic line.
 *
 * Phase 11D — recruiter clarity: every evidence reference now carries the
 * record's title beside its accession ID (the keystone treatment), so a
 * reader knows WHAT a reference points at without leaving the section or
 * relying on hover. Hover/focus still confirms — the accession re-inks to
 * the accent and the title lifts — but understanding never depends on it.
 * Role notes and the primary paragraphs were rewritten in the same pass to
 * read at first pass; the technical depth stays in the dossiers.
 */

function EvidenceRefs({ evidence }: { evidence: readonly ResolvedEvidenceRef[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
      {evidence.map((item) => (
        <li key={item.artifactId} className="min-w-0">
          <a
            href={`#record-${item.artifactId}`}
            aria-label={`Open ${item.accessionId} — ${item.title} in the Engineering Library${item.supporting ? " (supporting evidence)" : ""}`}
            className="group/ref inline-flex min-h-[44px] items-center rounded-sm px-1.5"
          >
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
              {item.supporting && (
                <span
                  aria-hidden="true"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60"
                >
                  also
                </span>
              )}
              <span className="font-mono text-xs tracking-[0.15em] text-foreground underline decoration-border underline-offset-4 transition-colors duration-200 group-hover/ref:text-accent-cyan group-hover/ref:decoration-accent-cyan group-focus-visible/ref:text-accent-cyan">
                {item.accessionId}
              </span>
              <span className="text-[11px] leading-tight text-muted-foreground/80 transition-colors duration-200 group-hover/ref:text-foreground/85 group-focus-visible/ref:text-foreground/85">
                <span aria-hidden="true" className="mr-1.5 text-muted-foreground/40">
                  ·
                </span>
                {item.title}
                {item.qualifier && (
                  <span className="ml-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    ({item.qualifier})
                  </span>
                )}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PracticeIndex() {
  return (
    <section
      id="practice"
      aria-label="AI Engineering"
      className="paper-register relative isolate overflow-hidden bg-background text-foreground"
    >
      {/* faint paper grain — same texture as the rest of the archive */}
      <div aria-hidden="true" className="grain-paper absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="border-t border-border pt-10 sm:pt-14">
          {/* hairline section break · kicker */}
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
            04 / AI Engineering
          </p>

          {/* ------------------- primary direction ------------------- */}
          <div className="mt-10 sm:mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
              Primary direction
            </p>

            <h2
              id="practice-heading"
              className="mt-4 text-[2.6rem] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl"
            >
              AI Engineer.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The five systems above are one practice: I take AI products from
              idea to working software — answers grounded in retrieved sources,
              agents that stay within approved actions, and model results
              checked against baselines.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The Python backends and{" "}
              {/* whitespace-nowrap: keep the brand compound unbroken (C-2) */}
              <span className="whitespace-nowrap">AI-native</span> full-stack
              products around them are part of the same work — built, tested,
              and documented like everything else in the record.
            </p>

            {/* the section's single serif-italic human line */}
            <p className="mt-7 max-w-lg font-serif-accent text-xl leading-snug text-foreground/85 sm:text-2xl">
              Read from the record — not asserted ahead of it.
            </p>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
                Evidence — verified records
              </p>
              <div className="mt-2">
                <EvidenceRefs evidence={PRIMARY_DIRECTION.evidence} />
              </div>
            </div>
          </div>

          {/* ------------------- role directions ------------------- */}
          <div className="mt-16 sm:mt-20">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
              Role directions
            </h3>

            <ol className="mt-5 border-t border-border">
              {ROLE_DIRECTIONS.map((role, index) => (
                <li
                  key={role.id}
                  className="grid grid-cols-1 gap-x-6 gap-y-3 border-b border-border py-6 sm:py-7 lg:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,26rem)] lg:items-start"
                >
                  <span
                    aria-hidden="true"
                    className="pt-1.5 font-mono text-[11px] tabular-nums tracking-[0.15em] text-muted-foreground/60"
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <div>
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">
                      {role.title}
                    </h4>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {role.note}
                    </p>
                  </div>

                  <div className="lg:pt-1.5">
                    <EvidenceRefs evidence={role.evidence} />
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ------------------- capabilities ------------------- */}
          <div className="mt-16 sm:mt-20">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
              Capabilities
            </h3>

            <ul className="mt-5 border-t border-border">
              {CAPABILITIES.map((capability) => (
                <li
                  key={capability.id}
                  className="flex flex-col gap-y-2.5 border-b border-border py-5 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="shrink-0 text-[15px] text-foreground sm:w-72 lg:w-80">
                    {capability.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden flex-1 -translate-y-0.5 border-b border-dotted border-foreground/25 sm:block"
                  />
                  <div className="sm:justify-self-end">
                    <EvidenceRefs evidence={capability.evidence} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* affordance colophon — honest about what a reference does */}
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            Every reference scrolls to its verified record in the Engineering
            Library — the dossier opens from the record itself.
          </p>
        </div>
      </div>
    </section>
  );
}
