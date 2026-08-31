import Image from "next/image";

/**
 * 05 / The Archivist — the person behind the record (PROVENANCE, Phase 3).
 *
 * Server Component, paper register. Answers three questions — who is Rishav,
 * what is his background, what does he focus on — in concise natural prose.
 * CONFIRMED FACTS ONLY: name, location, degree + AI specialization, 2026
 * graduation, and the eight core areas. No college name, no GPA, no
 * internships, no roles, no achievements, no certifications, no metrics.
 *
 * The portrait is the same real photograph as the hero plate (single-file
 * contract: public/images/profile.jpg), presented as a paper-register plate
 * with a museum-label caption. `id="about"` lives here — the header nav and
 * the hero's "About Me" CTA resolve to this section.
 */

const CORE_AREAS: readonly string[] = [
  "Artificial Intelligence",
  "Generative AI / LLM applications",
  "RAG and retrieval systems",
  "Agentic AI and tool-using workflows",
  "Applied Machine Learning",
  "AI-native full-stack development",
  "Python / backend engineering",
  "Data and intelligent systems",
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="paper-register relative isolate overflow-hidden bg-background text-foreground"
    >
      {/* faint paper grain — same texture as the rest of the archive */}
      <div aria-hidden="true" className="grain-paper absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="border-t border-border pt-10 sm:pt-14">
          {/* hairline section break · kicker */}
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
            05 / The Archivist
          </p>

          <h2
            id="about-heading"
            className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            The person behind the record.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* prose column (right on mobile order: portrait first) */}
            <div className="order-2 lg:order-1">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                I&apos;m Rishav Raj — a Computer Science Engineering student
                from Patna, Bihar, India, specializing in Artificial
                Intelligence. I graduate in 2026.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                My focus is{" "}
                {/* whitespace-nowrap: keep the brand compound unbroken (C-2) */}
                <span className="whitespace-nowrap">AI-native</span> engineering
                — generative and LLM applications, retrieval-augmented
                systems, agentic and tool-using workflows, and the Python
                backends and data foundations that make them work in
                practice.
              </p>

              {/* the section's single serif-italic human line */}
              <p className="mt-7 max-w-lg font-serif-accent text-xl leading-snug text-foreground/85 sm:text-2xl">
                I like taking an idea all the way to working software.
              </p>

              {/* subject headings — the eight confirmed core areas */}
              <div className="mt-10 sm:mt-12">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
                  Subject headings
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {CORE_AREAS.map((area, index) => (
                    <li
                      key={area}
                      className="flex items-baseline gap-4 border-t border-border/70 py-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-mono text-[10px] tabular-nums tracking-[0.15em] text-muted-foreground/60"
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">
                        {/* whitespace-nowrap on the brand compound (C-2) */}
                        {area.split(/(AI-native)/).map((part, i) =>
                          part === "AI-native" ? (
                            <span key={i} className="whitespace-nowrap">
                              {part}
                            </span>
                          ) : (
                            part
                          ),
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* portrait plate — same photograph as the hero, paper treatment */}
            <figure className="order-1 mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:order-2 lg:mx-0 lg:max-w-[21rem] lg:justify-self-end">
              <div className="relative aspect-[3/4] border border-foreground/15 bg-surface">
                <Image
                  src="/images/profile.jpg"
                  alt="Portrait of Rishav Raj"
                  fill
                  sizes="(min-width:1024px) 21rem, (min-width:640px) 22rem, 80vw"
                  className="object-cover"
                />

                {/* registration ticks (ink variant of the archival motif) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-foreground/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-foreground/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-foreground/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-foreground/25"
                />
              </div>

              {/* museum-label caption — confirmed metadata only */}
              <figcaption className="mt-3">
                <span className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>Rishav Raj — The Archivist</span>
                  <span className="text-muted-foreground/50">02</span>
                </span>
                <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  Patna, Bihar, India · B.Tech CSE (AI) · Class of 2026
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
