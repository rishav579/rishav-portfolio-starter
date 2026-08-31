"use client";

import type { SceneNodeId } from "@/components/three/scene-config";
import { setHoverNode, useTopologyState } from "@/components/three/topology-store";

/**
 * PipelineIndex — the hero's live index into the archive (Phase 11A; the
 * coupling refined in Phase 11B).
 *
 * One mono readout of the seven intelligence-pipeline stages, each carrying
 * the number of records mapped to it. The counts are computed on the SERVER
 * from the structured `topologyNodes` of ARTIFACTS and passed in as props —
 * nothing here is hard-coded (Phase 11 numeric guardrail).
 *
 * Coupling is strictly the ONE shared topology store, in both directions:
 * - hover / focus / activation here drives `setHoverNode` → the 3D scene
 *   emphasizes exactly that topology node and its connected edges;
 * - hovering a node in the scene marks the same stage here — one semantic
 *   state system, never duplicated.
 * Activation toggles (touch has no hover: tap once to latch, again to
 * release). Without JS the strip renders fully and statically.
 */
export interface PipelineStage {
  readonly id: SceneNodeId;
  readonly label: string;
  readonly count: number;
}

export function PipelineIndex({
  stages,
}: {
  stages: readonly PipelineStage[];
}) {
  // Same store the scene and the library use — read-only here.
  const { hoverNode } = useTopologyState();
  const activeId = hoverNode;

  return (
    <div
      role="group"
      aria-label="Intelligence pipeline index — how many records map to each stage. Verification feeds back into retrieval. Focus a stage to highlight it in the scene above."
      className="absolute inset-x-0 bottom-0 z-10 hidden lg:block"
    >
      {/* instrument hairline over the hero's own bottom blend */}
      <div className="border-t border-accent-cyan-dim bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-1 px-6">
          <span className="flex min-h-[44px] items-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Pipeline index
          </span>

          {stages.map((stage) => {
            const active = activeId === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                aria-label={`${stage.label} — ${stage.count} ${
                  stage.count === 1 ? "record" : "records"
                } mapped to this stage. Activating highlights it in the pipeline scene; activating again releases it.`}
                data-active={active}
                onMouseEnter={() => setHoverNode(stage.id)}
                onMouseLeave={() => setHoverNode(null)}
                onFocus={() => setHoverNode(stage.id)}
                onBlur={() => setHoverNode(null)}
                onClick={() => setHoverNode(active ? null : stage.id)}
                className="group relative flex min-h-[44px] min-w-[44px] items-center gap-2 px-1.5"
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-150 group-hover:text-foreground group-focus-visible:text-foreground ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-[10px] tabular-nums transition-colors duration-150 ${
                    active ? "text-accent-cyan" : "text-accent-cyan/70"
                  }`}
                >
                  {stage.count.toString().padStart(2, "0")}
                </span>
                {/* scroll-spy tick vocabulary: 2px cyan hairline while the
                    stage is the one emphasized in the scene */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-1 bottom-2 h-px bg-accent-cyan transition-opacity duration-150 ${
                    active ? "opacity-90" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
