import { pipelineLabels } from "@/lib/artifacts";
import type { SceneNodeId } from "@/components/three/scene-config";

/**
 * Text pipeline mapping shown on artifact records and dossiers.
 *
 * This is the non-WebGL carrier of the 2D ↔ 3D semantics: the hero topology
 * is decorative, so the mapping itself is always readable as text here.
 *
 * Each arrow belongs to the chip it FOLLOWS OUT OF (Phase 3 fix): every
 * flex-wrap unit is atomic ("[CHIP →]"), so a wrapped line can never begin
 * with an orphaned arrow glyph.
 */
export function PipelineChips({ nodes }: { nodes: readonly SceneNodeId[] }) {
  const labels = pipelineLabels(nodes);
  if (labels.length === 0) return null;

  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80">
      <span className="sr-only">Pipeline mapping: </span>
      {labels.map((label, i) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="border border-border/80 bg-surface/60 px-1.5 py-0.5">
            {label}
          </span>
          {i < labels.length - 1 && (
            <span aria-hidden="true" className="text-muted-foreground/40">
              →
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
