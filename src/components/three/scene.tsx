"use client";

/**
 * Hero 3D scene — a living computational system.
 *
 * Entry boundary remains `scene-slot.tsx` (next/dynamic, ssr:false), so
 * three.js never reaches the server bundle. The scene is decorative
 * (aria-hidden wrapper): the semantic hero copy and figure caption carry all
 * portfolio meaning without WebGL.
 *
 * Performance model (integrated graphics):
 * - unlit materials, no lights/shadows/postprocessing/textures/models
 * - low-poly primitives, ~30 draw calls (11B adds exactly one: the
 *   dedicated feedback pulse; node labels are DOM, not geometry)
 * - zero allocations inside useFrame (preallocated temp vectors)
 * - frameloop pauses when offscreen (IntersectionObserver)
 * - prefers-reduced-motion → one static frame (frameloop "demand")
 *
 * Phase 11B — topology legibility: the one-time assembly clock and the
 * VERIFY → RETRIEVE feedback envelope live as render-loop singletons in
 * ./scene-runtime (module scope: the React Compiler forbids mutating
 * prop-received objects, and these are render-loop scratch, not state).
 * The one shared semantic state system remains the topology store.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SystemNodes } from "./nodes";
import { SystemEdges } from "./edges";
import { useSceneSettings } from "./use-scene-settings";
import { setHoverNode, useTopologyState } from "./topology-store";
import { COLORS, getLayout, type SceneNodeId } from "./scene-config";

/** Preallocated rig vectors — never recreated per frame. */
const _RIG_POS = new THREE.Vector3();

/** Tracks whether the figure panel is on screen. */
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

/**
 * Fixed camera with optional pointer parallax (±0.35 world units, lerped).
 * lookAt runs every frame so the framing is stable with or without parallax.
 * The target comes from the layout (desktop biases the topology right so the
 * hero headline owns the left of the frame).
 */
function CameraRig({
  parallax,
  baseY,
  target,
}: {
  parallax: boolean;
  baseY: number;
  target: THREE.Vector3;
}) {
  useFrame((state, delta) => {
    if (parallax) {
      // Framerate-independent smoothing factor.
      const k = 1 - Math.pow(0.0001, delta);
      _RIG_POS.set(
        state.pointer.x * 0.35,
        baseY + state.pointer.y * 0.22,
        state.camera.position.z,
      );
      state.camera.position.lerp(_RIG_POS, k);
    }
    state.camera.lookAt(target);
  });
  return null;
}

interface SceneContentProps {
  reducedMotion: boolean;
  compact: boolean;
  parallax: boolean;
  hoverNode: SceneNodeId | null;
  focusNodes: readonly SceneNodeId[];
}

function SceneContent({
  reducedMotion,
  compact,
  parallax,
  hoverNode,
  focusNodes,
}: SceneContentProps) {
  const invalidate = useThree((state) => state.invalidate);
  const layout = useMemo(() => getLayout(compact), [compact]);
  const target = useMemo(
    () => new THREE.Vector3(...layout.camera.lookAt),
    [layout],
  );

  // Reduced-motion uses the demand frameloop: render once, then re-render
  // only when the semantic hover/focus state changes.
  useEffect(() => {
    if (reducedMotion) invalidate();
  }, [reducedMotion, hoverNode, focusNodes, invalidate]);

  return (
    <>
      <fog attach="fog" args={[COLORS.fog, layout.fog.near, layout.fog.far]} />
      <CameraRig parallax={parallax} baseY={layout.camera.position[1]} target={target} />
      <AtmosphereDust compact={compact} reducedMotion={reducedMotion} />
      <SystemNodes
        nodes={layout.nodes}
        activeNode={hoverNode}
        focusNodes={focusNodes}
        onHover={setHoverNode}
        reducedMotion={reducedMotion}
      />
      <SystemEdges
        nodes={layout.nodes}
        activeNode={hoverNode}
        focusNodes={focusNodes}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

/**
 * Atmospheric depth layer — a sparse, slow dust field giving the environment
 * volume without becoming a particle show. One draw call, unlit points,
 * zero per-frame allocations. Compact devices get half the count.
 */
function AtmosphereDust({
  compact,
  reducedMotion,
}: {
  compact: boolean;
  reducedMotion: boolean;
}) {
  const count = compact ? 42 : 84;

  const { geometry, seeds, base } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1.2;
      seeds[i * 2] = Math.random() * Math.PI * 2;
      seeds[i * 2 + 1] = 0.1 + Math.random() * 0.18;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return {
      geometry,
      seeds,
      base: Float32Array.from(positions),
    };
  }, [count]);

  useFrame((state) => {
    if (reducedMotion) return;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const phase = seeds[i * 2];
      const speed = seeds[i * 2 + 1];
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * speed + phase) * 0.22;
      arr[i * 3] = base[i * 3] + Math.sin(t * speed * 0.6 + phase * 1.7) * 0.16;
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.045}
        color="#8fa3b8"
        transparent
        opacity={0.16}
        sizeAttenuation
        depthWrite={false}
        fog
      />
    </points>
  );
}

/** Static CSS fallback when WebGL is unavailable (r3f Canvas fallback). */
function NoWebGLFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/10 blur-3xl" />
    </div>
  );
}

export default function Scene() {
  const settings = useSceneSettings();
  const [containerRef, inView] = useInView();
  // Single shared topology state (also written by the library section).
  const { hoverNode, focusNodes } = useTopologyState();

  const frameloop = settings.reducedMotion
    ? ("demand" as const)
    : inView
      ? ("always" as const)
      : ("never" as const);

  const camera = useMemo(() => getLayout(settings.compact).camera, [settings.compact]);

  // Keep vertical page scroll working over the canvas on touch devices.
  useEffect(() => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) canvas.style.touchAction = "pan-y";
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0">
      {/* deep substrate behind the transparent canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_75%_at_62%_38%,oklch(0.17_0.02_260/0.55),transparent_72%)]" />
      <Canvas
        frameloop={frameloop}
        dpr={[1, settings.compact ? 1.5 : 2]}
        camera={{ fov: camera.fov, position: [...camera.position], near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
          stencil: false,
        }}
        onPointerMissed={() => setHoverNode(null)}
        fallback={<NoWebGLFallback />}
      >
        <SceneContent
          reducedMotion={settings.reducedMotion}
          compact={settings.compact}
          parallax={!settings.reducedMotion && settings.pointerFine}
          hoverNode={hoverNode}
          focusNodes={focusNodes}
        />
      </Canvas>
    </div>
  );
}
