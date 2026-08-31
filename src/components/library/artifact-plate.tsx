import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { ArtifactFigure, EngineeringArtifact } from "@/lib/artifacts";
import { StatusBadge } from "./status-badge";
import { TopologyGlyph } from "./topology-glyph";

/**
 * EvidenceStrip (Phase 11C) — the record's evidence footprint as catalog
 * metadata. Every count derives at render time from structured dossier
 * fields (figures · technicalDecisions · verification · links); a unit
 * with no structured backing is omitted, never invented. No test counts,
 * accuracy numbers, or deployment figures — those are not structured
 * fields and are left to the dossier prose where they are quoted from
 * executed runs.
 */
function evidenceUnits(artifact: EngineeringArtifact): string[] {
  const dossier = artifact.dossier;
  if (!dossier) return [];

  const pad = (n: number) => n.toString().padStart(2, "0");
  const units: string[] = [];
  if (dossier.figures.length > 0) {
    units.push(
      `${pad(dossier.figures.length)} ${dossier.figures.length === 1 ? "figure" : "figures"}`,
    );
  }
  if (dossier.technicalDecisions.length > 0) {
    units.push(
      `${pad(dossier.technicalDecisions.length)} ${dossier.technicalDecisions.length === 1 ? "decision" : "decisions"}`,
    );
  }
  if (dossier.verification.length > 0) {
    units.push(`${pad(dossier.verification.length)} verification`);
  }
  if (dossier.links.length > 0) {
    units.push(
      `${pad(dossier.links.length)} ${dossier.links.length === 1 ? "link" : "links"}`,
    );
  }
  return units;
}

/** Hairline-ruled strip above the plate actions — evidence before action. */
function EvidenceStrip({ artifact }: { artifact: EngineeringArtifact }) {
  const units = evidenceUnits(artifact);
  if (units.length === 0) return null;

  return (
    <div className="border-t border-border">
      <p
        className="mt-3.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        aria-label={`Evidence: ${units.join(", ")}`}
      >
        <span className="text-foreground/75">Evidence</span>
        {units.map((unit, i) => (
          <span key={unit} className="whitespace-nowrap">
            <span aria-hidden="true" className="mr-2 text-border">
              ·
            </span>
            <span className="tabular-nums text-foreground/80">
              {unit.slice(0, 2)}
            </span>{" "}
            {unit.slice(3)}
          </span>
        ))}
      </p>
    </div>
  );
}

/**
 * ArtifactPlate — featured artifacts as full-width editorial folios
 * (PROVENANCE Paper Archive, Phase 2B).
 *
 * These are NOT cards: hairline-ruled, open-sided plates on paper, each with
 * a ghost accession numeral, a shared catalog rail, and a deliberately
 * asymmetric composition driven by the evidence each artifact actually has:
 *
 * - Typographic/architecture-led (7/5): used when the repository has
 *   published no large UI capture. The verified brand graphic is mounted as
 *   a small specimen with an honest "no UI captures published" caption and
 *   an explicit figure-plates-reserved note. Nothing is fabricated.
 * - Image-led (8/4): used when a large verified screenshot exists — mounted
 *   museum-mat style, captioned from the verified data, fading in on load.
 *
 * Variant selection is data-driven (a figure >= 800px wide counts as plate
 * evidence), so the component invents nothing and hardcodes no artifact id.
 *
 * Mobile order (single column): image/specimen → metadata → title +
 * description → stack/glyph → actions, via CSS `order` — the brief-mandated
 * evidence-first sequence, zero JS.
 *
 * Hover/focus bridges into the hero topology through the shared
 * topology-store (same wiring as the ledger rows).
 */

interface ArtifactPlateProps {
  artifact: EngineeringArtifact;
  onInspect: (artifact: EngineeringArtifact) => void;
  onFocus: (artifact: EngineeringArtifact) => void;
  onUnfocus: (artifact: EngineeringArtifact) => void;
}

export function ArtifactPlate({
  artifact,
  onInspect,
  onFocus,
  onUnfocus,
}: ArtifactPlateProps) {
  const { ref } = usePlateReveal();
  // A large verified figure is plate evidence; otherwise the plate stays
  // typography-led rather than fabricating a screenshot.
  const heroFigure =
    artifact.dossier?.figures.find((figure) => figure.width >= 800) ?? null;
  const numeral = artifact.accessionId.split("-").at(-1) ?? "";

  return (
    <article
      ref={ref}
      aria-labelledby={`plate-title-${artifact.id}`}
      data-artifact-plate={artifact.id}
      onMouseEnter={() => onFocus(artifact)}
      onMouseLeave={() => onUnfocus(artifact)}
      onFocus={() => onFocus(artifact)}
      onBlur={() => onUnfocus(artifact)}
      className="group/plate relative isolate border-b border-border px-6 py-10 last:border-b-0 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
    >
      {/* ghost accession numeral — catalog watermark hanging from the top
          rule. Phase 11C polish: Fragment Mono's natural weight (no
          synthetic bold), a folio leading so it hangs from the hairline,
          and a slightly tighter set — quieter and more stamped, same
          archival identity, same whisper ink. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-0 -z-10 select-none font-mono text-[6rem] font-normal leading-[0.78] tracking-[-0.05em] text-foreground/[0.05] sm:right-8 sm:text-[8rem] lg:text-[9rem]"
      >
        {numeral}
      </span>

      {heroFigure ? (
        <ImagePlateBody
          artifact={artifact}
          heroFigure={heroFigure}
          onInspect={onInspect}
        />
      ) : (
        <TypographicPlateBody artifact={artifact} onInspect={onInspect} />
      )}
    </article>
  );
}

/* ------------------------------ reveal hook ------------------------------ */

/**
 * Reveal the plate once, on first intersection. Static-visible by default
 * (SSR/no-JS/no-IO all render fully visible); arming and revealing are done
 * with direct DOM class writes — an external-system update, no React state —
 * so nothing renders twice. The global prefers-reduced-motion rule also
 * kills the animation for reduced-motion users.
 */
function usePlateReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    element.classList.add("opacity-0");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          element.classList.remove("opacity-0");
          element.classList.add("animate-plate-in");
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      element.classList.remove("opacity-0");
      element.classList.remove("animate-plate-in");
    };
  }, []);

  return { ref };
}

/* ------------------------- typographic plate 7/5 ------------------------- */

function TypographicPlateBody({
  artifact,
  onInspect,
}: {
  artifact: EngineeringArtifact;
  onInspect: (artifact: EngineeringArtifact) => void;
}) {
  return (
    <div className="grid gap-7 sm:gap-9 lg:grid-cols-12 lg:gap-x-10">
      {/* specimen — right column on desktop, first on mobile */}
      <div className="order-1 lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 lg:self-center">
        <MarkSpecimen artifact={artifact} />
      </div>

      {/* metadata rail */}
      <div className="order-2 lg:col-span-7 lg:col-start-1 lg:row-start-1">
        <PlateRail artifact={artifact} />
      </div>

      {/* title + description */}
      <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2">
        <h4
          id={`plate-title-${artifact.id}`}
          className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-foreground"
        >
          {artifact.title}
        </h4>
        <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {artifact.description}
        </p>
      </div>

      {/* stack + topology glyph */}
      <div className="order-4 lg:col-span-7 lg:col-start-1 lg:row-start-3">
        <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-muted-foreground">
          {artifact.technologies.join(" · ")}
        </p>
        <div className="mt-4">
          <TopologyGlyph nodes={artifact.topologyNodes} />
        </div>
      </div>

      {/* evidence strip + actions */}
      <div className="order-5 lg:col-span-7 lg:col-start-1 lg:row-start-4">
        <EvidenceStrip artifact={artifact} />
        <div className="mt-5">
          <PlateActions artifact={artifact} onInspect={onInspect} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- image-led plate 8/4 -------------------------- */

function ImagePlateBody({
  artifact,
  heroFigure,
  onInspect,
}: {
  artifact: EngineeringArtifact;
  heroFigure: ArtifactFigure;
  onInspect: (artifact: EngineeringArtifact) => void;
}) {
  return (
    <div className="grid gap-7 sm:gap-9 lg:grid-cols-12 lg:gap-x-10">
      {/* the evidence — full-width on mobile, 8 columns on desktop */}
      <figure className="order-1 lg:col-span-8 lg:col-start-1 lg:row-start-1">
        <div className="border border-border bg-surface p-2 sm:p-3">
          <PlateFigure
            figure={heroFigure}
            sizes="(min-width:1024px) 46rem, 100vw"
          />
        </div>
        <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {heroFigure.caption}
        </figcaption>
      </figure>

      {/* metadata rail */}
      <div className="order-2 lg:col-span-4 lg:col-start-9 lg:row-start-1">
        <PlateRail artifact={artifact} />
      </div>

      {/* title + description */}
      <div className="order-3 lg:col-span-8 lg:col-start-1 lg:row-start-2">
        <h4
          id={`plate-title-${artifact.id}`}
          className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-foreground"
        >
          {artifact.title}
        </h4>
        <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {artifact.description}
        </p>
      </div>

      {/* stack + glyph — the evidence strip below carries the figure count,
          so the plate states its footprint once (Phase 11C de-duplication) */}
      <div className="order-4 lg:col-span-4 lg:col-start-9 lg:row-start-2">
        <p className="font-mono text-xs leading-relaxed tracking-[0.08em] text-muted-foreground">
          {artifact.technologies.join(" · ")}
        </p>
        <div className="mt-4">
          <TopologyGlyph nodes={artifact.topologyNodes} />
        </div>
      </div>

      {/* evidence strip + actions */}
      <div className="order-5 lg:col-span-12 lg:col-start-1 lg:row-start-3">
        <EvidenceStrip artifact={artifact} />
        <div className="mt-5">
          <PlateActions artifact={artifact} onInspect={onInspect} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ shared parts ------------------------------ */

/** Catalog rail: accession · category — VERIFIED. */
function PlateRail({ artifact }: { artifact: EngineeringArtifact }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {artifact.accessionId}
        <span aria-hidden="true" className="mx-2 text-border">
          ·
        </span>
        {artifact.categoryLabel}
      </p>
      <StatusBadge status={artifact.status} />
    </div>
  );
}

/**
 * Mounted plate image — museum-mat frame (paper mat + hairline rule), lazy,
 * fading from paper-tone to full ink once loaded. Lazy below-fold images
 * only fetch near the viewport, long after hydration has attached onLoad.
 */
function PlateFigure({
  figure,
  sizes,
}: {
  figure: ArtifactFigure;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={figure.src}
      alt={figure.alt}
      width={figure.width}
      height={figure.height}
      sizes={sizes}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`h-auto w-full transition-opacity duration-700 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/** RepoPilot: the verified brand graphic as a mounted specimen — no fakes. */
function MarkSpecimen({ artifact }: { artifact: EngineeringArtifact }) {
  const figure = artifact.dossier?.figures[0];

  return (
    <figure className="mx-auto w-full max-w-[17rem] lg:mx-0 lg:max-w-none">
      <div className="border border-border bg-surface p-4 sm:p-6">
        {figure && (
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            sizes="(min-width:1024px) 27rem, 72vw"
            loading="lazy"
            className="mx-auto h-auto w-full"
          />
        )}
      </div>
      <figcaption className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
        Repository brand graphic — no UI captures published
      </figcaption>
      <p className="mt-4 border border-dashed border-border px-3.5 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/80 lg:text-left">
        Figure plates — reserved
      </p>
    </figure>
  );
}

/** Editorial actions: case study opens the dossier; externals in new tabs. */
function PlateActions({
  artifact,
  onInspect,
}: {
  artifact: EngineeringArtifact;
  onInspect: (artifact: EngineeringArtifact) => void;
}) {
  const links = (artifact.dossier?.links ?? []).filter(
    (link) => link.kind !== "docs",
  );

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-1.5">
      <button
        type="button"
        aria-haspopup="dialog"
        data-artifact-trigger={`plate-${artifact.id}`}
        onClick={() => onInspect(artifact)}
        className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors duration-200 hover:text-accent-cyan hover:decoration-accent-cyan"
      >
        Open case study
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>

      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-[44px] items-center gap-2 text-sm transition-colors duration-200 ${
            link.kind === "live"
              ? "text-accent-cyan hover:text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {link.kind === "live" && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"
            />
          )}
          {link.kind === "live" ? "Live demo" : "GitHub"}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">
            — {link.label} (opens in a new tab
            {link.kind === "live" ? " — verified live deployment" : ""})
          </span>
        </a>
      ))}
    </div>
  );
}
