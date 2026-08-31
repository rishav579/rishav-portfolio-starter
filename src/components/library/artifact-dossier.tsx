"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EngineeringArtifact } from "@/lib/artifacts";
import { PipelineChips } from "./pipeline-chips";
import { StatusBadge } from "./status-badge";

interface ArtifactDialogProps {
  /** Last opened artifact — kept mounted through the close transition. */
  artifact: EngineeringArtifact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * data-artifact-trigger id of the element that opened this dossier
   * (a ledger row id, or "plate-{id}" for a featured plate). Used to
   * restore focus on close.
   */
  triggerId?: string;
}

/**
 * Artifact dossier — a full-height archive panel, dressed in the Paper
 * Archive register (Phase 2B).
 *
 * Chosen over a dedicated route so the hero topology (with the artifact's
 * pipeline mapping still highlighted) remains the semantic context behind
 * the panel. Radix provides focus trap, Escape, and focus restoration.
 *
 * Presentation-only changes from Phase 2: `paper-register` on the content
 * (the dialog portals outside the section, so the class rides along), an
 * asymmetric header with a right metadata rail (status / stack / pipeline /
 * links), hairline-ruled sections, and museum-mat screenshot mounting —
 * 2-up on larger screens, single column on mobile. ALL verified content is
 * rendered verbatim from the data model.
 */
export function ArtifactDialog({
  artifact,
  open,
  onOpenChange,
  triggerId,
}: ArtifactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {artifact && (
        <DialogContent
          className="paper-register flex h-svh max-h-none w-full max-w-none flex-col gap-0 overflow-hidden rounded-none border-x-0 p-0 text-foreground sm:h-auto sm:max-h-[min(85svh,56rem)] sm:max-w-3xl sm:rounded-lg sm:border-x"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            // Controlled dialog has no Radix trigger element — restore
            // focus to whatever opened this dossier (plate action or row).
            event.preventDefault();
            document
              .querySelector<HTMLButtonElement>(
                `[data-artifact-trigger="${triggerId || artifact.id}"]`,
              )
              ?.focus();
          }}
        >
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
            <article aria-label={`${artifact.title} — artifact dossier`}>
              <DossierHeader artifact={artifact} />
              {artifact.dossier && <DossierBody artifact={artifact} />}
            </article>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

/* ------------------------------- header ---------------------------------- */

function DossierHeader({ artifact }: { artifact: EngineeringArtifact }) {
  return (
    <header className="border-b border-border/70 px-6 pb-8 pr-16 pt-7 sm:px-8 sm:pt-8">
      {/* catalog metadata strip (Phase 11C): accession · record title ·
          status — the way a catalog card reads. Derived directly from the
          artifact's own fields, so it always matches its record. */}
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>{artifact.accessionId}</span>
        <span aria-hidden="true" className="text-border">·</span>
        <span className="text-foreground/75">{artifact.title}</span>
        <span aria-hidden="true" className="text-border">·</span>
        <span
          className={
            artifact.status === "VERIFIED"
              ? "text-accent-cyan"
              : "text-muted-foreground"
          }
        >
          {artifact.status}
        </span>
      </p>

      {/* asymmetric narrative: record identity left, metadata rail right */}
      <div className="mt-4 gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {artifact.title}
          </DialogTitle>
          <DialogDescription className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {artifact.description}
          </DialogDescription>
        </div>

        <aside className="mt-7 space-y-6 lg:mt-0">
          <RailGroup label="Status">
            <StatusBadge status={artifact.status} />
          </RailGroup>

          {artifact.technologies.length > 0 && (
            <RailGroup label="Stack">
              <ul className="space-y-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
                {artifact.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </RailGroup>
          )}

          {artifact.topologyNodes.length > 0 && (
            <RailGroup label="Pipeline mapping">
              <PipelineChips nodes={artifact.topologyNodes} />
            </RailGroup>
          )}

          {artifact.dossier && artifact.dossier.links.length > 0 && (
            <RailGroup label="Links">
              <ul>
                {artifact.dossier.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-between gap-2 border-b border-border/60 text-xs transition-colors duration-200 hover:text-accent-cyan"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {link.kind === "live" && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"
                          />
                        )}
                        <span className="truncate">{link.label}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={link.kind === "live" ? "text-accent-cyan/70" : undefined}
                      >
                        ↗
                      </span>
                      <span className="sr-only">
                        (opens in a new tab{link.kind === "live" ? " — verified live deployment" : ""})
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </RailGroup>
          )}
        </aside>
      </div>
    </header>
  );
}

function RailGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* -------------------------------- body ----------------------------------- */

function DossierBody({ artifact }: { artifact: EngineeringArtifact }) {
  const d = artifact.dossier;
  if (!d) return null;

  // Section numbers are computed so optional dossier sections (whyBuilt,
  // system, aiAgentWorkflow) can exist without renumbering other artifacts.
  // Links live in the header metadata rail, so the body ends at Limitations.
  let sectionIndex = 0;
  const nextIndex = () => (++sectionIndex).toString().padStart(2, "0");

  return (
    <div className="space-y-9 px-6 py-9 sm:px-8">
      <DossierSection index={nextIndex()} title="Overview">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {d.overview}
        </p>
      </DossierSection>

      <DossierSection index={nextIndex()} title="Problem">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {d.problem}
        </p>
      </DossierSection>

      {d.whyBuilt && (
        <DossierSection index={nextIndex()} title="Why I built it">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {d.whyBuilt}
          </p>
        </DossierSection>
      )}

      {d.system && (
        <DossierSection index={nextIndex()} title="System">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {d.system}
          </p>
        </DossierSection>
      )}

      <DossierSection index={nextIndex()} title="Architecture">
        {/* Phase 11C connector rail: a hairline runs through the number
            column so the layers read as one connected stack. Wording and
            content are untouched — the numbers carry a paper knock-out so
            the rule breaks around them. */}
        <ol className="relative space-y-3.5">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[8px] top-[7px] w-px bg-border/80"
          />
          {d.architecture.map((layer, i) => (
            <li
              key={i}
              className="flex gap-3.5 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="relative z-10 mt-0.5 bg-background px-[3px] font-mono text-[10px] tracking-[0.1em] text-accent-cyan/70"
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{layer}</span>
            </li>
          ))}
        </ol>
      </DossierSection>

      {d.aiAgentWorkflow && d.aiAgentWorkflow.length > 0 && (
        <DossierSection index={nextIndex()} title="AI / agent workflow">
          {/* same connector rail as Architecture — one visual language for
              connected steps (Phase 11C) */}
          <ol className="relative space-y-3.5">
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-[8px] top-[7px] w-px bg-border/80"
            />
            {d.aiAgentWorkflow.map((stage, i) => (
              <li
                key={i}
                className="flex gap-3.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-0.5 bg-background px-[3px] font-mono text-[10px] tracking-[0.1em] text-accent-violet/80"
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span>{stage}</span>
              </li>
            ))}
          </ol>
        </DossierSection>
      )}

      <DossierSection index={nextIndex()} title="Technical decisions">
        <ul className="grid gap-3 sm:grid-cols-2">
          {d.technicalDecisions.map((decision) => (
            <li key={decision.id} className="border border-border/70 bg-surface/40 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan/80">
                {decision.id}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-foreground">
                {decision.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {decision.rationale}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
          {d.technicalDecisionsNote ??
            "Summarized from the decision records published in the repository"}
        </p>
      </DossierSection>

      <DossierSection index={nextIndex()} title="Implementation">
        <ul className="space-y-2.5">
          {d.implementation.map((item, i) => (
            <Bullet key={i}>{item}</Bullet>
          ))}
        </ul>
      </DossierSection>

      <DossierSection index={nextIndex()} title="Verification">
        <ul className="space-y-2.5">
          {d.verification.map((item, i) => (
            <Bullet key={i}>{item}</Bullet>
          ))}
        </ul>
        {d.verificationNote && (
          <p className="mt-4 border-l-2 border-accent-violet/50 pl-3.5 text-xs italic leading-relaxed text-muted-foreground">
            {d.verificationNote}
          </p>
        )}
      </DossierSection>

      <DossierSection index={nextIndex()} title="Screenshots">
        {d.figures.length === 0 ? (
          <p className="border border-dashed border-border px-4 py-6 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            No figures published yet — plates reserved
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {d.figures.map((figure) => (
              <figure key={figure.src}>
                {/* museum mat: paper mount + hairline rule around the plate */}
                <div className="border border-border bg-surface p-2">
                  <Image
                    src={figure.src}
                    alt={figure.alt}
                    width={figure.width}
                    height={figure.height}
                    sizes="(min-width:640px) 22rem, 100vw"
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {figure.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </DossierSection>

      <DossierSection index={nextIndex()} title="Limitations">
        <ul className="space-y-2.5">
          {d.limitations.map((item, i) => (
            <Bullet key={i}>{item}</Bullet>
          ))}
        </ul>
      </DossierSection>
    </div>
  );
}

function DossierSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  const headingId = `dossier-section-${index}`;
  return (
    <section aria-labelledby={headingId} className="border-t border-border/80 pt-7">
      <h3
        id={headingId}
        className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span aria-hidden="true" className="text-accent-cyan/80">
          {index}
        </span>
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
      <span
        aria-hidden="true"
        className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent-cyan/50"
      />
      <span>{children}</span>
    </li>
  );
}
