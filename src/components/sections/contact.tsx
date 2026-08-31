import { ArrowUpRight } from "lucide-react";

import { CopyEmailButton } from "@/components/sections/copy-email-button";

/**
 * 06 / Correspondence — direct channels (PROVENANCE, Phase 3).
 *
 * Server Component, paper register. Carries `id="contact"` (moved from the
 * footer, so the header nav resolves here). Three clickable channels —
 * email (mailto), GitHub and LinkedIn (external links with
 * target/rel semantics) — plus one non-interactive reserved row for the
 * resume. No contact form, nothing invented.
 *
 * Phase 11D — recruiter clarity: the email row gains a quiet secondary
 * "Copy" control (the one genuinely useful clipboard action — mailto
 * forces a mail client, many people use webmail). The mailto link remains
 * the primary interaction; the copy button is a sibling, not a nested
 * control. A closing provenance line states the archive's own provenance
 * before the end-of-record rule.
 */

interface Channel {
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly ariaLabel: string;
  readonly external: boolean;
}

/** The email row is rendered explicitly (mailto anchor + copy control as
 * siblings); CHANNELS lists only the external link rows. */
const EMAIL = "rishav07122003@gmail.com";

const CHANNELS: readonly Channel[] = [
  {
    label: "GitHub",
    value: "github.com/rishav579",
    href: "https://github.com/rishav579",
    ariaLabel: "Rishav Raj on GitHub — opens in a new tab",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/rishav-raj-091524322/",
    href: "https://www.linkedin.com/in/rishav-raj-091524322/",
    ariaLabel: "Rishav Raj on LinkedIn — opens in a new tab",
    external: true,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="paper-register relative isolate overflow-hidden bg-background text-foreground"
    >
      <div aria-hidden="true" className="grain-paper absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 sm:pb-28 sm:pt-20">
        <div className="border-t border-border pt-10 sm:pt-14">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-accent-cyan/70" />
            06 / Correspondence
          </p>

          <div className="max-w-2xl">
            <h2
              id="contact-heading"
              className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
            >
              Direct channels.
            </h2>

            {/* the section's single serif-italic human line */}
            <p className="mt-6 max-w-lg font-serif-accent text-xl leading-snug text-foreground/85 sm:text-2xl">
              I read every message.
            </p>
          </div>

          {/* channel rows — holdings-row language, no form.
              The email row is a flex container holding the mailto anchor
              (primary) and the copy control (secondary sibling) so no
              interactive element is ever nested inside another. */}
          <div className="mt-10 border-t border-border sm:mt-12">
            <div className="flex items-center border-b border-border">
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Email Rishav Raj"
                className="group flex min-h-[44px] min-w-0 flex-1 flex-col gap-1.5 px-2 py-5 transition-colors duration-200 hover:bg-surface/70 focus-visible:bg-surface/70 sm:flex-row sm:items-center sm:gap-6 sm:px-3"
              >
                <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:w-28">
                  Email
                </span>
                <span className="min-w-0 flex-1 break-words text-base text-foreground transition-colors duration-200 group-hover:text-accent-cyan [overflow-wrap:anywhere] sm:text-lg">
                  {EMAIL}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent-cyan sm:inline-flex"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
              <CopyEmailButton email={EMAIL} />
            </div>
            {CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                aria-label={channel.ariaLabel}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex min-h-[44px] flex-col gap-1.5 border-b border-border px-2 py-5 transition-colors duration-200 hover:bg-surface/70 focus-visible:bg-surface/70 sm:flex-row sm:items-center sm:gap-6 sm:px-3"
              >
                <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:w-28">
                  {channel.label}
                </span>
                <span className="min-w-0 flex-1 break-words text-base text-foreground transition-colors duration-200 group-hover:text-accent-cyan sm:text-lg">
                  {channel.value}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent-cyan sm:inline-flex"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            ))}

            {/* resume — honest reserved slot, not a link */}
            <div
              aria-disabled="true"
              className="flex min-h-[44px] flex-col gap-1.5 border-b border-border px-2 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-3"
            >
              <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 sm:w-28">
                Resume
              </span>
              <span className="min-w-0 flex-1 text-base text-muted-foreground sm:text-lg">
                Resume — coming soon
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
                [ Reserved ]
              </span>
            </div>
          </div>

          {/* closing provenance line (Phase 11D) — the archive closes by
              stating its own provenance: authorship and traceability. */}
          <p className="mt-10 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-muted-foreground/80">
            Designed and built by Rishav Raj — every verified record in this
            archive links back to its repository.
          </p>

          {/* the archive's full stop before the dark plinth */}
          <div aria-hidden="true" className="mt-16 flex items-center gap-4 sm:mt-20">
            <span className="h-px flex-1 bg-border" />
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70">
              End of record
            </p>
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
