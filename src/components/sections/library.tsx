import { LibraryExplorer } from "@/components/library/library-explorer";
import { ARTIFACTS, COLLECTIONS } from "@/lib/artifacts";

/**
 * 03 / Engineering Library — the Paper Archive (PROVENANCE, Phase 2B).
 *
 * Server Component shell. The section carries the `paper-register` class, so
 * every semantic token inside resolves to the warm archival register while
 * the rest of the site stays in the Machine Hall. The intro keeps the
 * approved kicker/heading, adds the room's one serif-italic line, and
 * replaces the old KPI panel with a single computed colophon line. The
 * explorer island below carries COLLECTIONS → FEATURED ARTIFACTS → FULL
 * HOLDINGS INDEX with all verified content server-rendered.
 */
export function Library() {
  const verifiedCount = ARTIFACTS.filter((a) => a.status === "VERIFIED").length;
  const reservedCount = ARTIFACTS.filter((a) => a.status === "RESERVED").length;

  // Phase 11A numeric guardrail: every colophon figure is derived at render
  // time from structured dossier fields — never hand-written.
  const figureCount = ARTIFACTS.reduce(
    (n, a) => n + (a.dossier?.figures.length ?? 0),
    0,
  );
  const liveCount = ARTIFACTS.filter((a) =>
    a.dossier?.links.some((link) => link.kind === "live"),
  ).length;

  const colophonItems = [
    `${ARTIFACTS.length.toString().padStart(2, "0")} records`,
    `${verifiedCount.toString().padStart(2, "0")} verified`,
    `${reservedCount.toString().padStart(2, "0")} reserved`,
    `${COLLECTIONS.length.toString().padStart(2, "0")} collections`,
    ...(figureCount > 0
      ? [`${figureCount.toString().padStart(2, "0")} figures`]
      : []),
    ...(liveCount > 0
      ? [`${liveCount.toString().padStart(2, "0")} live deployments`]
      : []),
  ];

  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="paper-register relative isolate overflow-hidden bg-background text-foreground"
    >
      {/* faint paper grain — the archive's texture, static by rule */}
      <div aria-hidden="true" className="grain-paper absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-2 pt-24 sm:pt-28">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
            03 / Engineering Library
          </p>

          <h2
            id="library-heading"
            className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            Systems, experiments, and{" "}
            <span className="text-muted-foreground">engineering work.</span>
          </h2>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            A curated index of built artifacts. Each record carries an
            accession ID, a technology line, and its mapping onto the
            intelligence pipeline above — open a record to read the full
            dossier: problem, architecture, decisions, and evidence.
          </p>

          {/* the room's single human line — Instrument Serif italic */}
          <p className="mt-7 max-w-lg font-serif-accent text-xl leading-snug text-foreground/85 sm:text-2xl">
            Real systems, honestly documented — every claim traceable to its
            repository.
          </p>

          {/* computed colophon — honest counts, no KPI panel; the figures /
              live-deployment facts were added in Phase 11A and are derived,
              never hard-coded. Facts wrap as whole units, never mid-word. */}
          <p className="mt-8 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {colophonItems.map((item, i) => (
              <span key={item} className="whitespace-nowrap">
                {i > 0 && (
                  <span aria-hidden="true" className="mr-2 text-border">
                    ·
                  </span>
                )}
                {item}
              </span>
            ))}
          </p>
        </div>
      </div>

      <LibraryExplorer artifacts={ARTIFACTS} collections={COLLECTIONS} />
    </section>
  );
}
