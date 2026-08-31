import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { ARTIFACTS } from "@/lib/artifacts";
import { NODES } from "@/components/three/scene-config";
import { SceneSlot } from "@/components/three/scene-slot";
import { PipelineIndex } from "@/components/sections/pipeline-index";

/**
 * Hero — "The Portrait Machine" (PROVENANCE, Phase 1B; photo Phase 3;
 * AI-era repositioning Phase 11A).
 *
 * Server Component. Composition order (desktop): identity column left,
 * portrait plate right, living computational environment full-bleed behind.
 * The first viewport now reads PRACTICE → PERSON → VISUAL WORLD:
 *   1. AI ENGINEER — Personal Engineering Library (kicker)
 *   2. RISHAV RAJ (dominant editorial type)
 *   3. practice statement + CSE credential
 *   4. portrait plate (the real photograph — public/images/profile.jpg)
 *   5. the 7-node topology as atmosphere (framing keeps its right tail
 *      clear of the plate column; see scene-config.ts)
 *   6. two clear next actions + the Pipeline Index strip (desktop)
 *
 * Pipeline Index counts are computed HERE on the server from the structured
 * `topologyNodes` of ARTIFACTS — a numeric guardrail: no hand-written metrics.
 *
 * Mobile keeps the strict brief order via CSS `order` on a single column:
 * name → positioning → portrait → supporting copy → CTA.
 */
export function Hero() {
  const pipelineStages = NODES.map((node) => ({
    id: node.id,
    label: node.label,
    count: ARTIFACTS.filter((artifact) =>
      artifact.topologyNodes.includes(node.id),
    ).length,
  }));

  return (
    <section
      id="index"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* ------------------- Machine Hall environment ------------------- */}
      <div aria-hidden="true" className="animate-atmo-in absolute inset-0 -z-10">
        {/* living topology — lazy WebGL island, full-bleed background */}
        <div className="absolute inset-0">
          <SceneSlot />
        </div>
        {/* text-protection scrims: headline stays dominant left, portrait
            column stays clean right (Phase 3 collision fix) */}
        <div className="hero-scrim-left absolute inset-0" />
        <div className="hero-scrim-right absolute inset-0" />
        {/* radial vignette: the environment recedes toward the edges */}
        <div className="hero-vignette absolute inset-0" />
        {/* quiet blend into the section that follows */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        {/* static film grain — unifies type, plate, and environment */}
        <div className="grain-overlay absolute inset-0" />
      </div>

      {/* -------------------------- composition -------------------------- */}
      {/* pointer-events-none on the grid box itself: the topology scene is
          hoverable wherever no real content sits (Phase 11B coupling);
          interactive/content blocks re-enable pointers below */}
      <div className="pointer-events-none mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-6 pb-24 pt-28 sm:pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-28 lg:pt-24">
        {/* Identity column. On <lg it dissolves (display:contents) so the
            portrait can interleave at the brief-mandated position. */}
        <div className="pointer-events-auto max-lg:contents">
          <p
            className="animate-hero-rise order-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:text-[11px] sm:tracking-[0.32em]"
            style={{ animationDelay: "120ms" }}
          >
            <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
            AI Engineer — Personal Engineering Library
          </p>

          <h1
            id="hero-heading"
            className="animate-hero-rise relative z-10 order-2 mt-5 whitespace-nowrap text-[clamp(2.9rem,10vw,6.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:mt-6"
            style={{ animationDelay: "220ms" }}
          >
            Rishav Raj
          </h1>

          {/* Practice-first positioning (Phase 11A, approved): the practice
              statement leads; the CSE credential follows one beat later. */}
          <div className="animate-hero-rise order-3 mt-7 sm:mt-8" style={{ animationDelay: "380ms" }}>
            <p className="max-w-xl text-lg font-medium leading-snug text-foreground sm:text-xl">
              Intelligent systems, engineered end to end — retrieval-grounded
              generation, governed agents, and applied ML held to executed
              baselines.
            </p>
            <p className="mt-3.5 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Computer Science Engineering student specializing in{" "}
              <span className="text-foreground/90">Artificial Intelligence</span>
              {" "}— Generative AI, Agentic AI, and{" "}
              {/* whitespace-nowrap: the brand compound must never break at
                  its hyphen across lines (Phase 10, C-2) */}
              <span className="whitespace-nowrap text-foreground/90">
                AI-native full-stack
              </span>{" "}
              engineering.
            </p>
          </div>

          {/* The single serif-italic human accent of the page */}
          <p
            className="animate-hero-rise order-5 mt-7 max-w-md font-serif-accent text-xl leading-snug text-foreground/85 sm:mt-8 sm:text-2xl"
            style={{ animationDelay: "520ms" }}
          >
            I build practical software systems that combine artificial
            intelligence, data, and thoughtful engineering.
          </p>

          {/* Next actions — semantic links, keyboard reachable, 44px targets */}
          <div
            className="animate-hero-rise pointer-events-auto order-6 mt-8 flex flex-wrap items-center gap-3 sm:mt-9"
            style={{ animationDelay: "640ms" }}
          >
            <a
              href="#library"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-foreground px-6 text-sm font-medium text-background transition-colors duration-200 hover:bg-foreground/85"
            >
              Explore Engineering Library
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="inline-flex min-h-[44px] items-center rounded-sm border border-white/15 px-6 text-sm font-medium text-foreground/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/5 hover:text-foreground"
            >
              About Me
            </a>
          </div>
        </div>

        {/* --------------------- portrait plate --------------------- */}
        <figure
          className="animate-portrait-in pointer-events-auto order-4 relative z-0 mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:mx-0 lg:mt-0 lg:max-w-[23rem] lg:justify-self-end"
          style={{ animationDelay: "620ms" }}
        >
          <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-gradient-to-b from-surface-strong via-surface to-background">
            {/* near-opaque plate backing (Phase 3): no topology geometry can
                read through the portrait, with or without the photo loaded */}

            {/* the real photograph, unmodified — natural editorial crop.
                Source is exactly 3:4 (1086×1448), so object-cover is a
                near-zero crop and the face sits unobstructed. */}
            <Image
              src="/images/profile.jpg"
              alt="Portrait of Rishav Raj"
              fill
              priority
              sizes="(min-width:1024px) 23rem, (min-width:640px) 22rem, 80vw"
              className="object-cover"
            />

            {/* quiet foot fade for plate depth (below the face, never on it) */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/45 to-transparent"
            />

            {/* registration ticks (archival plate motif) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-white/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-white/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-white/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-white/25"
            />
          </div>

          <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            <span>Rishav Raj — Portrait</span>
            <span className="text-muted-foreground/50">01</span>
          </figcaption>
        </figure>
      </div>

      {/* viewport registration marks (Phase 11A) — the plate motif extended
          to the Machine Hall frame itself; decorative, desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      >
        <span className="absolute left-6 top-24 h-3 w-3 border-l border-t border-accent-cyan-dim" />
        <span className="absolute right-6 top-24 h-3 w-3 border-r border-t border-accent-cyan-dim" />
        <span className="absolute bottom-24 left-6 h-3 w-3 border-b border-l border-accent-cyan-dim" />
        <span className="absolute bottom-24 right-6 h-3 w-3 border-b border-r border-accent-cyan-dim" />
      </div>

      {/* pipeline index (Phase 11A) — real counts, live scene coupling;
          desktop only, the per-record glyphs carry the idea below lg */}
      <PipelineIndex stages={pipelineStages} />

      {/* scroll cue — quiet, decorative, reduced-motion aware; hands off
          to the pipeline index strip at lg (Phase 11A) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-7 z-10 hidden flex-col items-center gap-2.5 sm:flex lg:hidden"
      >
        <span className="animate-cue font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70">
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-muted-foreground/60 to-transparent" />
      </div>
    </section>
  );
}
