/**
 * Semantic configuration for the hero system topology.
 *
 * Pure data — no rendering. These nodes are a visual metaphor for the
 * intelligence pipeline (data → computation → generative AI → retrieval /
 * agents → verification → application). They are NOT claims about a real
 * production system, and the naming is intentionally easy to replace later.
 */

export type SceneNodeId =
  | "input"
  | "ingest"
  | "compute"
  | "retrieve"
  | "generate"
  | "verify"
  | "application";

export type NodeShape = "octahedron" | "icosahedron" | "panel";
export type NodeAccent = "neutral" | "cyan" | "violet";
export type EdgeKind = "flow" | "feedback";

export interface NodeSpec {
  readonly id: SceneNodeId;
  readonly label: string;
  readonly shape: NodeShape;
  readonly accent: NodeAccent;
  /** Base position in world units (desktop framing). */
  readonly position: readonly [number, number, number];
  /** Base node scale. */
  readonly scale: number;
  /** Number of orbiting computation motes (0 = none). */
  readonly motes: number;
  /** Soft generation field (GENERATE only). */
  readonly aura: boolean;
}

export interface EdgeSpec {
  readonly from: SceneNodeId;
  readonly to: SceneNodeId;
  readonly kind: EdgeKind;
}

/**
 * Palette mirrors the site design tokens defined in globals.css.
 * Machine Hall tuning: lines and wires sit BELOW the content — atmosphere,
 * not diagram. Accents stay reserved for semantic states.
 *
 * Phase 11B — dual-layer materials: each node is a DARK SOLID CORE (an
 * opaque body that occludes edges behind it, so the graph reads as physical
 * instruments) under a RESTRAINED WIRE SHELL (the luminous read). The
 * per-accent idle-wire tints let COMPUTE/GENERATE/VERIFY carry a whisper of
 * their semantic color at rest without any emissive effect.
 */
export const COLORS = {
  fog: "#0d0f15",
  wire: "#525c6b",
  wireCyanIdle: "#3e565f",
  wireVioletIdle: "#474060",
  wireActiveNeutral: "#c9d3de",
  core: "#dfe6ee",
  coreDark: "#0d1119",
  cyan: "#7fd7e2",
  violet: "#b49df2",
  line: "#3d4450",
  lineActive: "#7fd7e2",
  pulse: "#bfe9ef",
  pulseFeedback: "#8fdbe6",
  mote: "#8fa0b3",
} as const;

export const NODES: readonly NodeSpec[] = [
  { id: "input",       label: "Input",       shape: "octahedron",  accent: "neutral", position: [-3.55, 1.05, 0.5],  scale: 0.17, motes: 0, aura: false },
  { id: "ingest",      label: "Ingest",      shape: "octahedron",  accent: "neutral", position: [-2.4, 0.15, -0.6],  scale: 0.2,  motes: 0, aura: false },
  { id: "compute",     label: "Compute",     shape: "icosahedron", accent: "cyan",    position: [-1.2, 0.95, 0.2],   scale: 0.35, motes: 3, aura: false },
  { id: "retrieve",    label: "Retrieve",    shape: "octahedron",  accent: "neutral", position: [0.1, 0.0, -0.9],    scale: 0.27, motes: 0, aura: false },
  { id: "generate",    label: "Generate",    shape: "icosahedron", accent: "violet",  position: [1.0, 1.0, -0.3],    scale: 0.46, motes: 4, aura: true },
  { id: "verify",      label: "Verify",      shape: "octahedron",  accent: "cyan",    position: [1.95, 0.15, 0.4],   scale: 0.27, motes: 0, aura: false },
  { id: "application", label: "Application", shape: "panel",       accent: "neutral", position: [2.9, -0.55, -0.3],  scale: 0.52, motes: 0, aura: false },
];

/**
 * Forward pipeline plus one grounding loop: verification feeds retrieval.
 * Solid edges = forward flow. Dashed edge = feedback.
 */
export const EDGES: readonly EdgeSpec[] = [
  { from: "input", to: "ingest", kind: "flow" },
  { from: "ingest", to: "compute", kind: "flow" },
  { from: "compute", to: "retrieve", kind: "flow" },
  { from: "retrieve", to: "generate", kind: "flow" },
  { from: "generate", to: "verify", kind: "flow" },
  { from: "verify", to: "application", kind: "flow" },
  { from: "verify", to: "retrieve", kind: "feedback" },
];

export interface PositionedNode extends Omit<NodeSpec, "position"> {
  readonly position: readonly [number, number, number];
  /** Per-node motion phase offset (desynchronizes breathing). */
  readonly phase: number;
  /** Pipeline order (0..6) — drives the one-time assembly stagger. */
  readonly index: number;
}

/**
 * Phase 11B — one-time assembly timeline (seconds). Nodes rise into place
 * in pipeline order; edges fade in behind them. Total ≈1.2s, plays exactly
 * once per scene mount (never on scroll), skipped under reduced motion.
 */
export const ASSEMBLY = {
  nodeStagger: 0.06,
  nodeDuration: 0.55,
  edgeLead: 0.6,
  edgeStagger: 0.06,
  edgeDuration: 0.3,
} as const;

export function easeOutExpo(p: number): number {
  return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
}

/** Shared one-time assembly clock — `birth` is set on the first rendered frame. */
export interface SceneTimeline {
  birth: number | null;
}

/** Per-frame envelope (0..1) written by the feedback edge, read by RETRIEVE. */
export interface FeedbackSignal {
  value: number;
}

export interface SceneLayout {
  readonly nodes: readonly PositionedNode[];
  readonly camera: {
    fov: number;
    position: [number, number, number];
    /** Where the rig looks. Desktop keeps the topology band left of the
     *  portrait plate (Phase 3 collision fix): the right tail ends before
     *  the plate column begins, and the headline stays protected by the
     *  left scrim. */
    lookAt: [number, number, number];
  };
  readonly fog: { near: number; far: number };
}

/**
 * Desktop: full framing, topology biased right of center. Compact (mobile):
 * x-compressed, camera pulled back, centered — same topology, same meaning,
 * calmer presence behind stacked content.
 */
export function getLayout(compact: boolean): SceneLayout {
  const spread = compact
    ? { x: 0.78, y: 1.08, k: 0.9 }
    : { x: 1, y: 1, k: 1 };

  return {
    nodes: NODES.map((node, i) => ({
      ...node,
      position: [
        node.position[0] * spread.x,
        node.position[1] * spread.y,
        node.position[2],
      ] as const,
      scale: node.scale * spread.k,
      phase: i * 0.8,
      index: i,
    })),
    camera: compact
      ? { fov: 40, position: [0, 0.32, 11.4], lookAt: [-0.05, 0.35, 0] }
      : { fov: 38, position: [0, 0.3, 10.4], lookAt: [0.5, 0.1, 0] },
    fog: compact ? { near: 12.5, far: 23 } : { near: 10.2, far: 20 },
  };
}
