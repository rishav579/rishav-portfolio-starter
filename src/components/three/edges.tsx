"use client";

/**
 * System edges — Phase 11B.
 *
 * Forward flow: six solid curves, ONE restrained pulse each — smaller and
 * quieter than Phase 2. Motion here is information, not decoration.
 *
 * The signature behavior is the VERIFY → RETRIEVE feedback loop (the
 * grounding loop): a single cyan pulse leaves VERIFY, travels the dashed
 * curve, and the edge itself brightens in step with the pulse crossing it;
 * on arrival, RETRIEVE acknowledges with a brief brightening via the shared
 * per-frame signal ref. One continuous cycle — the relationship reads as an
 * event, not a screensaver.
 *
 * One-time assembly: edges fade in after the nodes have mostly settled
 * (≈0.6s after mount, everything visible by ≈1.26s), once per scene mount.
 * Reduced motion: no pulses, no entrance — the dashed loop is simply
 * visible at rest, and the feedback signal stays zero.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import {
  ASSEMBLY,
  COLORS,
  EDGES,
  easeOutExpo,
  type PositionedNode,
  type SceneNodeId,
} from "./scene-config";
import {
  markSceneBirth,
  sceneAge,
  writeFeedbackSignal,
} from "./scene-runtime";

/** Reused across frames — no per-frame allocation. */
const _POINT = new THREE.Vector3();

/**
 * Module-scope mutator for the feedback line's opacity. The React Compiler
 * forbids member assignment on hook-created values inside components; an
 * opaque function call is the sanctioned escape hatch (the same reason the
 * rest of the scene mutates three.js objects via their methods).
 */
function setLineOpacity(mat: THREE.LineDashedMaterial, opacity: number): void {
  mat.opacity = opacity;
}

/** Feedback cycle speed (curve fraction per second) — one loop ≈ 20s. */
const FEEDBACK_SPEED = 0.05;

interface SystemEdgesProps {
  nodes: readonly PositionedNode[];
  activeNode: SceneNodeId | null;
  /** Artifact-driven focus set — connected edges brighten, the rest dim. */
  focusNodes: readonly SceneNodeId[];
  reducedMotion: boolean;
}

export function SystemEdges({
  nodes,
  activeNode,
  focusNodes,
  reducedMotion,
}: SystemEdgesProps) {
  const positionById = useMemo(() => {
    const map = new Map<SceneNodeId, THREE.Vector3>();
    for (const node of nodes) map.set(node.id, new THREE.Vector3(...node.position));
    return map;
  }, [nodes]);

  const curves = useMemo(
    () =>
      EDGES.map((edge) => {
        const from = positionById.get(edge.from);
        const to = positionById.get(edge.to);
        if (!from || !to) {
          throw new Error(`Unknown edge endpoint: ${edge.from} → ${edge.to}`);
        }
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const distance = from.distanceTo(to);
        // Arc gently above the path; the feedback loop dips below it.
        mid.y += edge.kind === "feedback" ? -0.6 : 0.22 + distance * 0.06;
        mid.z += 0.1;
        return new THREE.QuadraticBezierCurve3(from, mid, to);
      }),
    [positionById],
  );

  /** Restrained forward flow: one quiet pulse per solid edge. */
  const pulsePlan = useMemo(() => {
    const plan: Array<{ curve: number; speed: number; phase: number }> = [];
    curves.forEach((_, i) => {
      if (EDGES[i].kind !== "flow") return;
      plan.push({
        curve: i,
        speed: 0.045 + 0.012 * (i % 3),
        phase: (i * 0.37) % 1,
      });
    });
    return plan;
  }, [curves]);

  // Direct hover suspends artifact dimming (same rule as nodes).
  const focusActive = focusNodes.length > 0 && activeNode === null;

  const dimmedCurves = useMemo(
    () =>
      EDGES.map((edge) => {
        const lit =
          activeNode === edge.from ||
          activeNode === edge.to ||
          (focusActive &&
            (focusNodes.includes(edge.from) || focusNodes.includes(edge.to)));
        return focusActive && !lit;
      }),
    [activeNode, focusActive, focusNodes],
  );

  // One-time entrance fade for the solid flow lines (refs, not state).
  const lineRefs = useRef<Array<{ material: { opacity: number } } | null>>([]);
  const entranceDone = useRef(false);

  useFrame((state) => {
    if (reducedMotion || entranceDone.current) return;
    const t = state.clock.getElapsedTime();
    markSceneBirth(t);
    const age = sceneAge(t);
    const total =
      ASSEMBLY.edgeLead +
      (EDGES.length - 1) * ASSEMBLY.edgeStagger +
      ASSEMBLY.edgeDuration;
    if (age > total + 0.05) {
      entranceDone.current = true;
      return;
    }
    // Solid flow lines only (indices 0..len-2); the feedback edge fades itself.
    for (let i = 0; i < EDGES.length - 1; i++) {
      const line = lineRefs.current[i];
      if (!line) continue;
      const p = Math.min(
        1,
        Math.max(
          0,
          (age - (ASSEMBLY.edgeLead + i * ASSEMBLY.edgeStagger)) /
            ASSEMBLY.edgeDuration,
        ),
      );
      const e = easeOutExpo(p);
      const edge = EDGES[i];
      const lit =
        activeNode === edge.from ||
        activeNode === edge.to ||
        (focusActive &&
          (focusNodes.includes(edge.from) || focusNodes.includes(edge.to)));
      const dimmed = focusActive && !lit;
      const target = lit ? 0.85 : dimmed ? 0.08 : 0.3;
      line.material.opacity = target * e;
    }
  });

  return (
    <group>
      {curves.map((curve, i) => {
        const edge = EDGES[i];
        if (edge.kind === "feedback") {
          return (
            <FeedbackEdge
              key={`${edge.from}-${edge.to}`}
              curve={curve}
              index={i}
              activeNode={activeNode}
              focusNodes={focusNodes}
              focusActive={focusActive}
              reducedMotion={reducedMotion}
            />
          );
        }
        const hoverConnected = activeNode === edge.from || activeNode === edge.to;
        const focusConnected =
          focusActive &&
          (focusNodes.includes(edge.from) || focusNodes.includes(edge.to));
        const lit = hoverConnected || focusConnected;
        const dimmed = focusActive && !lit;
        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            points={curve.getPoints(28)}
            color={lit ? COLORS.lineActive : COLORS.line}
            lineWidth={lit ? 1.6 : 1.3}
            transparent
            opacity={lit ? 0.85 : dimmed ? 0.08 : 0.3}
          />
        );
      })}
      {!reducedMotion && pulsePlan.length > 0 && (
        <DataPulses plan={pulsePlan} curves={curves} dimmedCurves={dimmedCurves} />
      )}
    </group>
  );
}

interface DataPulsesProps {
  plan: ReadonlyArray<{ curve: number; speed: number; phase: number }>;
  curves: readonly THREE.QuadraticBezierCurve3[];
  /** Curves whose pulses shrink to nothing while their edge is dimmed. */
  dimmedCurves: readonly boolean[];
}

/**
 * Data in motion — restrained. One InstancedMesh for every flow pulse: a
 * single draw call, smaller and dimmer than Phase 2.
 */
function DataPulses({ plan, curves, dimmedCurves }: DataPulsesProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.pulse,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const inst = mesh.current;
    if (!inst) return;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < plan.length; i++) {
      const p = plan[i];
      const k = (t * p.speed + p.phase) % 1;
      curves[p.curve].getPoint(k, _POINT);
      dummy.position.copy(_POINT);
      // Pulses ease in and out at nodes; vanish on dimmed curves.
      const base = dimmedCurves[p.curve] ? 0.0001 : 0.024 + 0.02 * Math.sin(Math.PI * k);
      dummy.scale.setScalar(base);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, plan.length]}
      frustumCulled={false}
    />
  );
}

interface FeedbackEdgeProps {
  curve: THREE.QuadraticBezierCurve3;
  /** Index within EDGES (drives the entrance stagger). */
  index: number;
  activeNode: SceneNodeId | null;
  focusNodes: readonly SceneNodeId[];
  focusActive: boolean;
  reducedMotion: boolean;
}

/**
 * The signature behavior: VERIFY → RETRIEVE.
 *
 * Rendered as a first-class three.js Line (not drei's prop-driven Line) so
 * the edge material can breathe with the pulse: opacity rises as the cyan
 * pulse crosses the dashed curve and falls as it moves on. On arrival the
 * shared `feedbackSignal` envelope lets the RETRIEVE node acknowledge —
 * one relationship, communicated by motion alone.
 */
function FeedbackEdge({
  curve,
  index,
  activeNode,
  focusNodes,
  focusActive,
  reducedMotion,
}: FeedbackEdgeProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(36),
    );
    const material = new THREE.LineDashedMaterial({
      color: COLORS.line,
      transparent: true,
      opacity: 0,
      dashSize: 0.16,
      gapSize: 0.12,
      fog: true,
    });
    const l = new THREE.Line(geometry, material);
    l.computeLineDistances();
    return l;
  }, [curve]);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  const touchesFeedback = (focusNodes: readonly SceneNodeId[]) =>
    focusNodes.includes("verify") || focusNodes.includes("retrieve");

  // Semantic color (lit vs resting) — a state change, not a per-frame cost.
  useEffect(() => {
    const mat = line.material as THREE.LineDashedMaterial;
    const lit =
      activeNode === "verify" ||
      activeNode === "retrieve" ||
      (focusActive && touchesFeedback(focusNodes));
    mat.color.set(lit ? COLORS.lineActive : COLORS.line);
  }, [activeNode, focusActive, focusNodes, line]);

  useFrame((state) => {
    const mat = line.material as THREE.LineDashedMaterial;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      // Static, but present: the grounding loop stays visible at rest.
      setLineOpacity(mat, 0.32);
      writeFeedbackSignal(0);
      return;
    }

    // One-time entrance fade (after the nodes have mostly settled).
    markSceneBirth(t);
    const age = sceneAge(t);
    const ep = Math.min(
      1,
      Math.max(
        0,
        (age - (ASSEMBLY.edgeLead + index * ASSEMBLY.edgeStagger)) /
          ASSEMBLY.edgeDuration,
      ),
    );
    const entrance = easeOutExpo(ep);

    const dimmed = focusActive && !touchesFeedback(focusNodes);
    const lit =
      activeNode === "verify" ||
      activeNode === "retrieve" ||
      (focusActive && touchesFeedback(focusNodes));

    // Pulse travelling VERIFY → RETRIEVE; the edge brightens in step.
    const k = (t * FEEDBACK_SPEED) % 1;
    const env = Math.sin(Math.PI * k);
    const base = dimmed ? 0.06 : lit ? 0.85 : 0.2;
    setLineOpacity(mat, Math.min(0.88, (base + (dimmed ? 0.08 : 0.26) * env) * entrance));

    // Arrival envelope: rises as the pulse nears RETRIEVE, decays just
    // after wrap — continuous across the cycle boundary.
    const arrival =
      k > 0.78 ? (k - 0.78) / 0.22 : k < 0.18 ? 1 - k / 0.18 : 0;
    writeFeedbackSignal(arrival * (dimmed ? 0.25 : 1));

    const pulse = pulseRef.current;
    if (pulse) {
      curve.getPoint(k, _POINT);
      pulse.position.copy(_POINT);
      pulse.scale.setScalar((0.03 + 0.024 * env) * (dimmed ? 0.4 : 1));
    }
    if (pulseMatRef.current) {
      pulseMatRef.current.opacity = dimmed ? 0.2 : 0.75;
    }
  });

  return (
    <group>
      <primitive object={line} />
      {!reducedMotion && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            ref={pulseMatRef}
            color={COLORS.pulseFeedback}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog
          />
        </mesh>
      )}
    </group>
  );
}
