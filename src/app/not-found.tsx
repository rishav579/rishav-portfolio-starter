import { ArrowRight } from "lucide-react";

/**
 * 404 — Record not found (PROVENANCE, Phase 10).
 *
 * The Machine Hall register's own language: mono metadata kicker, editorial
 * sans heading, one honest line, one route-back action. No new motifs, no
 * animation. `id="main-content"` is preserved so the layout's skip link
 * still resolves. Rendered inside the root layout shell, so the sticky
 * footer holds even on this short page.
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex flex-1 flex-col items-start justify-center px-6 py-28"
    >
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
        <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
        404 / Record not found
      </p>

      <h1 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        This address is not in the archive.
      </h1>

      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        The record was never cataloged, or the address is mistyped.
      </p>

      <a
        href="/#library"
        className="mt-10 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-foreground px-6 text-sm font-medium text-background transition-colors duration-200 hover:bg-foreground/85"
      >
        Return to the Engineering Library
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </main>
  );
}
