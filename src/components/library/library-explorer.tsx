"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Collection,
  type CollectionId,
  type EngineeringArtifact,
} from "@/lib/artifacts";
import {
  clearArtifactFocus,
  setArtifactFocus,
} from "@/components/three/topology-store";
import { ArtifactDialog } from "./artifact-dossier";
import { ArtifactPlate } from "./artifact-plate";
import { PipelineChips } from "./pipeline-chips";
import { StatusBadge } from "./status-badge";

interface LibraryExplorerProps {
  artifacts: readonly EngineeringArtifact[];
  collections: readonly Collection[];
}

type Filter = CollectionId | "all";

/**
 * Client island for the Engineering Library — Paper Archive (Phase 2B).
 *
 * Receives the full, server-authored artifact data as props (the text is in
 * the SSR HTML). Structure: COLLECTIONS (editorial TOC, replaces the filter
 * pills — same aria-pressed semantics and filtering logic) → FEATURED
 * ARTIFACTS (curated, always visible, asymmetric plates) → FULL HOLDINGS
 * INDEX (the compact ledger the TOC filters). Interactivity stays limited
 * to what the brief allows: filtering, hover/focus topology bridging, and
 * the dossier dialog.
 *
 * Focus restoration is scope-aware: a dossier opened from a plate returns
 * focus to that plate's action; one opened from a ledger row returns to the
 * row (distinct data-artifact-trigger ids).
 */
export function LibraryExplorer({ artifacts, collections }: LibraryExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  // Kept mounted through the close transition; replaced on next open.
  const [openArtifact, setOpenArtifact] = useState<EngineeringArtifact | null>(null);
  // Which trigger opened the dialog (for focus restoration).
  const [triggerId, setTriggerId] = useState("");
  // The #record-* fragment currently marked as consumed (its intent has been
  // handled). The same value re-arriving through effect re-runs or hashchange
  // is stale state, not a new request — see the effect below.
  const consumedHashRef = useRef<string | null>(null);
  // Record highlighted via the JS recovery path (row was filtered out when
  // the evidence reference was clicked — see the effect below).
  const [recoveredId, setRecoveredId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", artifacts.length]]);
    for (const collection of collections) {
      map.set(
        collection.id,
        artifacts.filter((artifact) => artifact.collections.includes(collection.id))
          .length,
      );
    }
    return map;
  }, [artifacts, collections]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? artifacts
        : artifacts.filter((artifact) => artifact.collections.includes(filter)),
    [artifacts, filter],
  );

  /** Curated folios — verified records with a dossier. Never filtered. */
  const featured = useMemo(
    () => artifacts.filter((artifact) => !artifact.reserved && artifact.dossier),
    [artifacts],
  );

  /* -------------------- 2D → 3D topology bridge -------------------- */

  const focusArtifact = useCallback((artifact: EngineeringArtifact) => {
    if (artifact.topologyNodes.length > 0) {
      setArtifactFocus(artifact.topologyNodes, artifact.id);
    }
  }, []);

  const unfocusArtifact = useCallback((artifact: EngineeringArtifact) => {
    clearArtifactFocus(artifact.id);
  }, []);

  const openDossier = useCallback(
    (artifact: EngineeringArtifact, trigger: string) => {
      setOpenArtifact(artifact);
      setTriggerId(trigger);
      setDialogOpen(true);
      // Preserve the semantic context while the dossier is open.
      focusArtifact(artifact);
    },
    [focusArtifact],
  );

  const closeDossier = useCallback(() => {
    setDialogOpen(false);
    if (openArtifact) unfocusArtifact(openArtifact);
  }, [openArtifact, unfocusArtifact]);

  /* Evidence references from the Practice Index (04 / AI Engineering)
   * target `#record-<artifact-id>`. Native anchors own the scrolling and the
   * CSS :target rule on each ledger row whenever the record is rendered; the
   * island only intervenes when a collection filter is hiding the target row
   * (the browser can neither scroll to it nor set :target on it).
   *
   * State model (B-1 fix — stale-hash filter revert):
   * - A #record-* fragment is user INTENT and is consumed at most once per
   *   distinct value (consumedHashRef). This effect re-runs on every filter
   *   change (`visible` is a dependency); a consumed fragment re-read there
   *   is stale state, not new intent, and must NOT re-fire the recovery —
   *   otherwise a stale hash silently reverts the user's filter.
   * - References are also handled on click (document-level delegation): a
   *   click is always fresh intent. This covers re-clicking the same
   *   reference (no hashchange fires) and keyboard activation (Enter
   *   dispatches click). Modified clicks (new-tab, downloads) are ignored.
   * - The URL is never rewritten: Next.js's client router rewrites the
   *   address bar on its own effect cycle and would race the fragment, and
   *   the browser never re-resolves a :target element retroactively. */
  useEffect(() => {
    const recover = (artifact: EngineeringArtifact) => {
      consumedHashRef.current = `#record-${artifact.id}`;
      setFilter("all");
      setRecoveredId(artifact.id);
      window.setTimeout(() => {
        document.getElementById(`record-${artifact.id}`)?.scrollIntoView();
      }, 80);
    };

    const resolveReference = (artifactId: string, href: string) => {
      const artifact = artifacts.find((a) => a.id === artifactId);
      if (!artifact || artifact.reserved) return;
      if (visible.some((a) => a.id === artifact.id)) {
        // Record is rendered — native :target owns scroll + highlight. Mark
        // the fragment consumed (the follow-up hashchange is a no-op) and
        // drop any recovery highlight for a different record.
        consumedHashRef.current = href;
        setRecoveredId((prev) => (prev === artifact.id ? prev : null));
      } else {
        // Filtered out — recover: reset to full holdings, then highlight
        // and scroll the row from island state once it is rendered.
        recover(artifact);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest(
        'a[href^="#record-"]',
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const match = /^#record-([a-z0-9-]+)$/.exec(href);
      if (!match) return;
      resolveReference(match[1], href);
      // No preventDefault: the native navigation still runs (URL fragment,
      // plus :target when the row exists); the consumed hash makes the
      // follow-up hashchange a no-op.
    };

    const onHashChange = () => {
      const hash = window.location.hash;
      const match = /^#record-([a-z0-9-]+)$/.exec(hash);
      if (!match) {
        // Fragment gone — a nav link, or Next.js's router rewriting the
        // address bar after the fact. Not a record intent: allow future
        // recoveries, keep any recovery highlight.
        consumedHashRef.current = null;
        return;
      }
      if (consumedHashRef.current !== hash) resolveReference(match[1], hash);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [artifacts, visible]);

  // Phase 11D: numbers first, collection name last — the state reads at a
  // glance, instantly (no animation, no theatrics). aria-live stays polite.
  const activeCollection = collections.find((c) => c.id === filter);
  const filterStatusLabel =
    filter === "all"
      ? `Showing all ${artifacts.length} records`
      : `Showing ${visible.length} of ${artifacts.length} records — ${activeCollection?.label ?? ""}`;

  /* ----------------------------- render ----------------------------- */

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:pb-28">
      {/* ------------------------- COLLECTIONS ------------------------- */}
      <section aria-labelledby="collections-heading" className="mt-16">
        <BlockLabel id="collections-heading">Collections</BlockLabel>

        <div
          role="group"
          aria-label="Filter the holdings index by collection"
          className="mt-5 border-t border-border"
        >
          <CollectionRow
            code="C.00"
            label="Full holdings"
            tagline="The complete catalog — verified records and reserved slots."
            count={counts.get("all") ?? 0}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {collections.map((collection) => (
            <CollectionRow
              key={collection.id}
              code={collection.index}
              label={collection.label}
              tagline={collection.tagline}
              count={counts.get(collection.id) ?? 0}
              active={filter === collection.id}
              onClick={() => setFilter(collection.id)}
            />
          ))}
        </div>
      </section>

      {/* ---------------------- FEATURED ARTIFACTS ---------------------- */}
      <section aria-labelledby="featured-heading" className="mt-20 sm:mt-24">
        <BlockLabel id="featured-heading">Featured artifacts</BlockLabel>

        <div className="mt-6 border-y border-border">
          {featured.map((artifact) => (
            <ArtifactPlate
              key={artifact.id}
              artifact={artifact}
              onInspect={(a) => openDossier(a, `plate-${a.id}`)}
              onFocus={focusArtifact}
              onUnfocus={unfocusArtifact}
            />
          ))}
        </div>
      </section>

      {/* ---------------------- FULL HOLDINGS INDEX ---------------------- */}
      <section aria-labelledby="holdings-heading" className="mt-20 sm:mt-24">
        <BlockLabel id="holdings-heading">Full holdings index</BlockLabel>

        <p
          aria-live="polite"
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80"
        >
          {filterStatusLabel}
        </p>

        {/* Ledger column heads (desktop only, decorative — rows self-describe) */}
        <div
          aria-hidden="true"
          className="mt-8 hidden grid-cols-[7.5rem_minmax(0,1.6fr)_minmax(0,1fr)_10rem] gap-6 border-b border-border px-6 pb-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 lg:grid"
        >
          <span>Accession</span>
          <span className={COL_RULE}>Artifact</span>
          <span className={COL_RULE}>Stack</span>
          <span className={`text-right ${COL_RULE}`}>Status / Action</span>
        </div>

        {/* Ledger */}
        <ul key={filter} className="border-t border-border lg:border-t-0">
          {visible.map((artifact, index) => (
            <li
              key={artifact.id}
              id={`record-${artifact.id}`}
              className={`animate-row-in scroll-mt-24 [&:target]:bg-surface-strong/60 [&:target]:shadow-[inset_2px_0_0_0_var(--accent-cyan)] ${
                artifact.id === recoveredId
                  ? "bg-surface-strong/60 shadow-[inset_2px_0_0_0_var(--accent-cyan)]"
                  : ""
              }`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {artifact.reserved ? (
                <ReservedRow artifact={artifact} />
              ) : (
                <ArtifactRow
                  artifact={artifact}
                  onInspect={(a) => openDossier(a, a.id)}
                  onFocus={focusArtifact}
                  onUnfocus={unfocusArtifact}
                />
              )}
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <p className="border border-dashed border-border px-6 py-12 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            No records in this collection yet
          </p>
        )}
      </section>

      {/* legend */}
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Verified — record audited against its linked repository
        <span aria-hidden="true" className="mx-3 text-border">·</span>
        Reserved — slot held for a future artifact
      </p>

      {/* Dossier panel */}
      <ArtifactDialog
        artifact={openArtifact}
        open={dialogOpen}
        triggerId={triggerId}
        onOpenChange={(next) => {
          if (!next) closeDossier();
        }}
      />
    </div>
  );
}

/* ------------------------------ block label ------------------------------ */

/**
 * Phase 11C — holdings column hairline. Shared by the column-head row and
 * every ledger row so the vertical rules align across the whole index.
 * Desktop only; mobile stays a single quiet column.
 */
const COL_RULE = "lg:border-l lg:border-border/60 lg:pl-6";

function BlockLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80"
    >
      {children}
    </h3>
  );
}

/* --------------------------- collections TOC ----------------------------- */

interface CollectionRowProps {
  code: string;
  label: string;
  tagline?: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

/**
 * Editorial index entry — NOT a pill. Full-width hairline row: index code,
 * label, dotted leader to a tabular count, tagline beneath (larger screens).
 * Active state is a thin ink tick at the left edge and stronger ink text.
 */
function CollectionRow({
  code,
  label,
  tagline,
  count,
  active,
  onClick,
}: CollectionRowProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 border-b border-border px-2 py-3.5 text-left transition-colors duration-200 hover:bg-surface/70 sm:gap-4 sm:px-3 ${
        active ? "bg-surface/50" : ""
      }`}
    >
      {/* active ink tick */}
      <span
        aria-hidden="true"
        className={`absolute bottom-3 top-3 left-0 w-[2px] bg-foreground transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        className={`w-10 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] sm:w-12 ${
          active ? "text-foreground" : "text-muted-foreground/80"
        }`}
      >
        {code}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-3">
          <span
            className={`text-[15px] transition-colors duration-200 sm:text-base ${
              active
                ? "font-medium text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className="hidden min-w-6 flex-1 -translate-y-0.5 border-b border-dotted border-foreground/25 sm:block"
          />
          <span
            className={`ml-auto shrink-0 font-mono text-[11px] tabular-nums sm:ml-0 ${
              active ? "text-foreground" : "text-muted-foreground/70"
            }`}
          >
            {count.toString().padStart(2, "0")}
          </span>
        </span>
        {tagline && (
          <span className="mt-1 hidden text-xs leading-relaxed text-muted-foreground/80 sm:block">
            {tagline}
          </span>
        )}
      </span>
    </button>
  );
}

/* ------------------------------- ledger rows ------------------------------ */

interface ArtifactRowProps {
  artifact: EngineeringArtifact;
  onInspect: (artifact: EngineeringArtifact) => void;
  onFocus: (artifact: EngineeringArtifact) => void;
  onUnfocus: (artifact: EngineeringArtifact) => void;
}

function ArtifactRow({ artifact, onInspect, onFocus, onUnfocus }: ArtifactRowProps) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      data-artifact-trigger={artifact.id}
      onClick={() => onInspect(artifact)}
      onMouseEnter={() => onFocus(artifact)}
      onMouseLeave={() => onUnfocus(artifact)}
      onFocus={() => onFocus(artifact)}
      onBlur={() => onUnfocus(artifact)}
      className="group relative grid w-full grid-cols-1 gap-3 border-b border-border/70 px-4 py-6 text-left transition-colors duration-200 hover:bg-surface-strong/40 focus-visible:bg-surface-strong/40 lg:grid-cols-[7.5rem_minmax(0,1.6fr)_minmax(0,1fr)_10rem] lg:items-center lg:gap-6 lg:px-6"
    >
      {/* hover / focus accent */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.5 bg-accent-cyan opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
        {artifact.accessionId}
      </span>

      <span className={`min-w-0 ${COL_RULE}`}>
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent-cyan">
            {artifact.title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {artifact.categoryLabel}
          </span>
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
          {artifact.description}
        </span>
        {artifact.topologyNodes.length > 0 && (
          <span className="mt-3 block">
            <PipelineChips nodes={artifact.topologyNodes} />
          </span>
        )}
      </span>

      <span className={`font-mono text-xs leading-relaxed text-muted-foreground ${COL_RULE}`}>
        {artifact.technologies.join(" · ")}
      </span>

      <span className={`flex items-center justify-between gap-3 lg:flex-col lg:items-end lg:gap-2.5 ${COL_RULE}`}>
        <StatusBadge status={artifact.status} />
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan">
          Inspect artifact
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </span>
    </button>
  );
}

function ReservedRow({ artifact }: { artifact: EngineeringArtifact }) {
  return (
    <div
      aria-disabled="true"
      className="relative grid grid-cols-1 gap-3 border-b border-dashed border-border/60 px-4 py-6 lg:grid-cols-[7.5rem_minmax(0,1.6fr)_minmax(0,1fr)_10rem] lg:items-center lg:gap-6 lg:px-6"
    >
      <span className="font-mono text-xs tracking-[0.15em] text-muted-foreground/50">
        {artifact.accessionId}
      </span>

      <span className={`min-w-0 ${COL_RULE}`}>
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-lg font-medium tracking-tight text-muted-foreground">
            {artifact.title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {artifact.categoryLabel}
          </span>
        </span>
        <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground/70">
          {artifact.description}
        </span>
      </span>

      <span className={`font-mono text-xs text-muted-foreground/40 ${COL_RULE}`} aria-hidden="true">
        —
      </span>

      <span className={`flex items-center justify-between gap-3 lg:flex-col lg:items-end lg:gap-2.5 ${COL_RULE}`}>
        <StatusBadge status={artifact.status} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
          [ Future artifact ]
        </span>
      </span>
    </div>
  );
}
