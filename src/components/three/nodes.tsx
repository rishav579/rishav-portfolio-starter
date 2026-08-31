"use client";

/**
 * System nodes — Phase 11B "topology legibility".
 *
 * Each subsystem now reads as a physical instrument (dual-layer material):
 * a DARK SOLID CORE that occludes the edges behind it — so the graph gains
 * real depth and the pipeline order reads at a glance — under a RESTRAINED
 * WIRE SHELL that carries the semantic accent. COMPUTE / GENERATE / VERIFY
 * keep a whisper of their accent color at rest; no emissive effects.
 *
 * Tiny always-on DOM labels (Fragment Mono, ~50% opacity, scrim-protected
 * by the hero like every other scene element) make the pipeline readable
 * without any interaction — legibility never depends on hover. The scene
 * itself stays decorative (aria-hidden wrapper): the hero copy and the
 * Pipeline Index carry all portfolio meaning.
 *
 * One-time assembly entrance (≈0.9s for nodes, staggered in pipeline
 * order): each node rises a fraction of a unit into place while its
 * materials fade up. It plays once per scene mount, never replays on
 * scroll, and is skipped entirely under prefers-reduced-motion (final
 * state on the first frame).
 *
 * The RETRIEVE node reads `feedbackSignal` — a per-frame envelope written
 * by the VERIFY → RETRIEVE feedback edge (edges.tsx) — and acknowledges
 * each arrival with a brief, restrained brightening. A plain shared ref:
 * zero React state, zero re-renders, no duplicated state system.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  ASSEMBLY,
  COLORS,
  easeOutExpo,
  type NodeAccent,
  type PositionedNode,
  type SceneNodeId,
} from "./scene-config";
import {
  markSceneBirth,
  readFeedbackSignal,
  sceneAge,
} from "./scene-runtime";

const ACCENT_HEX: Record<NodeAccent, string> = {
  neutral: COLORS.wireActiveNeutral,
  cyan: COLORS.cyan,
  violet: COLORS.violet,
};

/** Resting wire tint per accent — a whisper of semantics at idle. */
const WIRE_IDLE_HEX: Record<NodeAccent, string> = {
  neutral: COLORS.wire,
  cyan: COLORS.wireCyanIdle,
  violet: COLORS.wireVioletIdle,
};

interface SystemNodesProps {
  nodes: readonly PositionedNode[];
  activeNode: SceneNodeId | null;
  /**
   * Artifact-driven focus set (library → topology bridge). When present and
   * no node is directly hovered, its nodes are emphasized and the rest dim.
   */
  focusNodes: readonly SceneNodeId[];
  onHover: (id: SceneNodeId | null) => void;
  reducedMotion: boolean;
}

export function SystemNodes({
  nodes,
  activeNode,
  focusNodes,
  onHover,
  reducedMotion,
}: SystemNodesProps) {
  // Direct scene hover suspends artifact dimming (hover wins, as in Phase 1).
  const focusActive = focusNodes.length > 0 && activeNode === null;

  return (
    <group>
      {nodes.map((node) => {
        const focused = focusActive && focusNodes.includes(node.id);
        return (
          <SystemNode
            key={node.id}
            node={node}
            active={activeNode === node.id}
            focused={focused}
            dimmed={focusActive && !focused}
            onHover={onHover}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </group>
  );
}

interface SystemNodeProps {
  node: PositionedNode;
  /** Direct scene hover — accent, scale, and label emphasis. */
  active: boolean;
  /** Artifact focus — accent and gentle lift, no extra emphasis. */
  focused: boolean;
  /** Artifact focus elsewhere — recede into the background. */
  dimmed: boolean;
  onHover: (id: SceneNodeId | null) => void;
  reducedMotion: boolean;
}

/**
 * A single subsystem node: dark solid core + restrained wire shell, optional
 * computation motes / generation field, generous invisible hit area, and a
 * tiny always-on semantic label.
 */
function SystemNode({
  node,
  active,
  focused,
  dimmed,
  onHover,
  reducedMotion,
}: SystemNodeProps) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const panelMat = useRef<THREE.MeshBasicMaterial>(null);
  const motesRef = useRef<THREE.Group>(null);
  const aura = useRef<THREE.Mesh>(null);
  const auraMat = useRef<THREE.MeshBasicMaterial>(null);
  /** Set once the assembly entrance has placed this node exactly. */
  const settled = useRef(false);

  useFrame((state, delta) => {
    const g = group.current;
    const w = wire.current;
    const wm = wireMat.current;
    if (!g || !w || !wm) return;

    // Framerate-independent smoothing, shared by every lerped property.
    const k = 1 - Math.pow(0.0015, delta);
    const t = state.clock.getElapsedTime();

    // One-time assembly (Phase 11B): progress 0..1, staggered in pipeline
    // order. During it, position/scale/opacity are set directly; afterwards
    // position is final (prop-driven) and the ambient system takes over.
    let entrance = 1;
    let assembling = false;
    if (!reducedMotion) {
      markSceneBirth(t);
      const age = sceneAge(t);
      const p = Math.min(
        1,
        Math.max(
          0,
          (age - node.index * ASSEMBLY.nodeStagger) / ASSEMBLY.nodeDuration,
        ),
      );
      entrance = easeOutExpo(p);
      assembling = p < 1;
      if (assembling) {
        const inv = 1 - entrance;
        g.position.set(
          node.position[0],
          node.position[1] - 0.26 * inv,
          node.position[2] - 0.5 * inv,
        );
      } else if (!settled.current) {
        settled.current = true;
        g.position.set(node.position[0], node.position[1], node.position[2]);
      }
    }

    // VERIFY → RETRIEVE arrival envelope (written by the feedback edge).
    const feedback =
      node.id === "retrieve" && !reducedMotion ? readFeedbackSignal() : 0;

    if (reducedMotion) {
      // Static semantics: same states, no temporal animation.
      wm.opacity = dimmed ? 0.1 : active || focused ? 0.95 : 0.5;
      if (coreMat.current) coreMat.current.opacity = dimmed ? 0.12 : 0.92;
      if (panelMat.current) panelMat.current.opacity = dimmed ? 0.02 : 0.85;
      if (motesRef.current) motesRef.current.visible = !dimmed;
      if (auraMat.current) auraMat.current.opacity = dimmed ? 0.03 : 0.12;
      return;
    }

    if (assembling) {
      g.scale.setScalar(node.scale * (0.55 + 0.45 * entrance));
    } else {
      // Ambient breathing — slow, phase-offset per node; a brief lift on
      // each feedback arrival.
      const breathe = 1 + 0.045 * Math.sin(t * 0.5 + node.phase);
      const target =
        node.scale *
        breathe *
        (active ? 1.14 : focused ? 1.07 : dimmed ? 0.95 : 1) *
        (1 + feedback * 0.05);
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, k));
    }

    // Gentle counter-rotation of shell vs core.
    w.rotation.y = t * 0.06 + node.phase;
    const c = core.current;
    if (c) c.rotation.y = -t * 0.1;

    // Computation motes orbit (hidden entirely when dimmed).
    const m = motesRef.current;
    if (m) {
      m.rotation.y = t * 0.14 + node.phase;
      m.visible = !dimmed;
    }

    // Generation field (GENERATE only): slow violet pulse.
    const a = aura.current;
    const am = auraMat.current;
    if (a && am) {
      a.scale.setScalar(1.25 + 0.12 * Math.sin(t * 0.55));
      const auraTarget =
        (dimmed ? 0.03 : 0.12 + 0.05 * Math.sin(t * 0.55)) * entrance;
      am.opacity = THREE.MathUtils.lerp(am.opacity, auraTarget, k);
    }

    const fbWire = Math.min(0.3, feedback * 0.3);
    const wireTarget = Math.min(
      0.97,
      ((dimmed
        ? 0.1
        : active
          ? 0.97
          : focused
            ? 0.92
            : 0.5 + 0.08 * Math.sin(t * 0.6 + node.phase)) +
        fbWire) *
        entrance,
    );
    wm.opacity = assembling
      ? wireTarget
      : THREE.MathUtils.lerp(wm.opacity, wireTarget, k);

    const coreTarget = (dimmed ? 0.12 : 0.92) * entrance;
    if (coreMat.current) {
      coreMat.current.opacity = assembling
        ? coreTarget
        : THREE.MathUtils.lerp(coreMat.current.opacity, coreTarget, k);
    }
    const panelTarget = (dimmed ? 0.02 : 0.85) * entrance;
    if (panelMat.current) {
      panelMat.current.opacity = assembling
        ? panelTarget
        : THREE.MathUtils.lerp(panelMat.current.opacity, panelTarget, k);
    }
  });

  const accent = ACCENT_HEX[node.accent];
  const lit = active || focused;

  return (
    <group
      ref={group}
      position={node.position as unknown as [number, number, number]}
      scale={node.scale}
    >
      {/* outer wireframe shell — the luminous read (layer 2) */}
      <mesh ref={wire}>
        {node.shape === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {node.shape === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {node.shape === "panel" && <boxGeometry args={[1.6, 1.0, 0.08]} />}
        <meshBasicMaterial
          ref={wireMat}
          wireframe
          transparent
          opacity={0.55}
          color={lit ? accent : WIRE_IDLE_HEX[node.accent]}
          fog
        />
      </mesh>

      {/* inner core / face — dark solid body (layer 1) */}
      {node.shape === "panel" ? (
        <mesh scale={[0.96, 0.94, 0.4]}>
          <boxGeometry args={[1.6, 1.0, 0.08]} />
          <meshBasicMaterial
            ref={panelMat}
            color={lit ? accent : COLORS.coreDark}
            transparent
            opacity={0.85}
            depthWrite={false}
            fog
          />
        </mesh>
      ) : (
        <mesh ref={core} scale={0.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={coreMat}
            color={COLORS.coreDark}
            transparent
            opacity={0.92}
            fog
          />
        </mesh>
      )}

      {/* computation motes (COMPUTE / GENERATE) */}
      {node.motes > 0 && (
        <group ref={motesRef} rotation={[0.5, 0, 0.2]}>
          {Array.from({ length: node.motes }, (_, i) => {
            const angle = (i / node.motes) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 2.1,
                  Math.sin(angle) * 0.5,
                  Math.sin(angle) * 2.1,
                ]}
              >
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial color={COLORS.mote} transparent opacity={0.6} fog />
              </mesh>
            );
          })}
        </group>
      )}

      {/* generation field (GENERATE only) */}
      {node.aura && (
        <mesh ref={aura} scale={1.2}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            ref={auraMat}
            wireframe
            transparent
            opacity={0.08}
            color={COLORS.violet}
            depthWrite={false}
            fog
          />
        </mesh>
      )}

      {/* generous invisible hit area (keeps hover comfortable) */}
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[2.4, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* always-on semantic label — tiny, restrained, legibility without
          hover; DOM overlay like the whole scene's semantic layer, dimmed
          further on small screens and under the hero scrims like the scene
          itself. Brightens when its node is emphasized. */}
      <Html
        center
        position={[0, node.shape === "panel" ? 1.15 : 1.9, 0]}
        zIndexRange={[0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          className={`animate-label-in pointer-events-none select-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] transition-colors duration-200 [text-shadow:0_1px_12px_oklch(0.13_0.016_262/0.95)] ${
            dimmed
              ? "text-foreground/20"
              : active
                ? "text-foreground"
                : focused
                  ? "text-foreground/80"
                  : "text-foreground/50 max-md:text-foreground/35"
          }`}
        >
          {node.label}
        </span>
      </Html>
    </group>
  );
}
