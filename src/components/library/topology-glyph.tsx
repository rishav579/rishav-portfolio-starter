import { NODES, type SceneNodeId } from "@/components/three/scene-config";
import { pipelineLabels } from "@/lib/artifacts";

/**
 * TopologyGlyph — a small static SVG imprint of the seven-stage intelligence
 * pipeline (PROVENANCE, Phase 2B).
 *
 * Supplementary by design: the stages and their order derive from the SAME
 * canonical NODES list that positions the 3D hero topology, with the
 * artifact's `topologyNodes` emphasized in re-inked cyan. It is a catalog
 * stamp, not a second scene — the living topology stays in the hero.
 *
 * Phase 11C — labeled refinement: each station now carries its stage name
 * in 6.6px Fragment Mono on two staggered rows (adjacent stages are only
 * ~38 units apart, so a single row would collide; the last label anchors
 * end so the long APPLICATION never clips). Labels are quiet by design —
 * faint ink for the off-mapping stages, accent ink with a hairline tick
 * for the artifact's own stages — and brighten only while the parent
 * plate is hovered or focused (pure CSS, no JS, no new tab stops). The
 * accessible name still carries the full stage sequence, so understanding
 * never depends on the labels or on hover.
 *
 * Accessibility: role="img" with a meaningful label (the full stage
 * sequence); the text-level carrier (PipelineChips) remains in the ledger
 * rows and the dossier, so understanding never depends on this SVG.
 */

const VIEW_W = 252;
const VIEW_H = 58;
const CY = 18;
const PAD = 12;
const STEP = (VIEW_W - PAD * 2) / (NODES.length - 1);

/** Staggered label baselines — even stages row A, odd stages row B. */
const ROW_A = 47;
const ROW_B = 56;

const INK_EDGE = "oklch(0.245 0.012 260 / 0.22)";

export function TopologyGlyph({ nodes }: { nodes: readonly SceneNodeId[] }) {
  if (nodes.length === 0) return null;

  const labels = pipelineLabels(nodes);
  // Labels for ALL seven stages — the glyph imprints the full pipeline;
  // the artifact's own stages are emphasized, the rest stay quiet.
  const stageLabels = pipelineLabels(NODES.map((node) => node.id));
  const highlighted = new Set<string>(nodes);

  const x = (index: number) => PAD + index * STEP;

  return (
    <svg
      role="img"
      aria-label={`Pipeline mapping: ${labels.join(" → ")}`}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={VIEW_W}
      height={VIEW_H}
      className="h-auto max-w-full"
      fill="none"
    >
      {/* connecting line — runs through all seven stages */}
      <line
        x1={x(0)}
        y1={CY}
        x2={x(NODES.length - 1)}
        y2={CY}
        stroke={INK_EDGE}
        strokeWidth={1}
      />

      {NODES.map((node, i) => {
        const on = highlighted.has(node.id);
        const labelY = i % 2 === 0 ? ROW_A : ROW_B;
        // First/last labels anchor outward so long words stay inside the view.
        const anchor =
          i === 0 ? "start" : i === NODES.length - 1 ? "end" : "middle";
        const labelX =
          i === 0 ? x(i) - 4 : i === NODES.length - 1 ? x(i) + 4 : x(i);

        return (
          <g key={node.id}>
            {/* node: emphasized stages in inked cyan, others faint stations */}
            {on ? (
              <>
                <circle
                  cx={x(i)}
                  cy={CY}
                  r={7}
                  stroke="var(--accent-cyan)"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                <circle cx={x(i)} cy={CY} r={3.5} fill="var(--accent-cyan)" />
                {/* tick — ties the station to its label (emphasized only) */}
                <line
                  x1={x(i)}
                  y1={CY + 10}
                  x2={x(i)}
                  y2={labelY - 6}
                  stroke="var(--accent-cyan)"
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              </>
            ) : (
              <circle
                cx={x(i)}
                cy={CY}
                r={2.5}
                fill="var(--background)"
                stroke="var(--foreground)"
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            )}

            {/* stage label — quiet ink; brightens subtly on plate hover/focus */}
            <text
              x={labelX}
              y={labelY}
              textAnchor={anchor}
              fontSize={6.6}
              letterSpacing="0.5"
              fill={on ? "var(--accent-cyan)" : "var(--foreground)"}
              className={`font-mono uppercase transition-opacity duration-200 ${
                on
                  ? "opacity-80 group-hover/plate:opacity-100 group-focus-within/plate:opacity-100"
                  : "opacity-30 group-hover/plate:opacity-50 group-focus-within/plate:opacity-50"
              }`}
            >
              {stageLabels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
