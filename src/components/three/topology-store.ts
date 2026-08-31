"use client";

/**
 * Single shared semantic state for the hero topology (Phase 2).
 *
 * Phase 1 kept `activeNode` as local state inside scene.tsx. Phase 2 lifts
 * that SAME state here so two directions can drive one system:
 *
 * - scene hover (existing Phase 1 behavior) → `setHoverNode`
 * - library artifacts (hover / focus / open dossier) → `setArtifactFocus`
 *
 * Emphasis rules applied by the scene:
 * - direct node hover always wins (label + connected edges, as in Phase 1)
 * - otherwise, when an artifact focus set exists, its nodes are emphasized,
 *   their edges brighten, and unrelated nodes/edges/pulses dim
 *
 * Zero dependencies — React's useSyncExternalStore only. There is exactly
 * ONE topology state system; nothing else should duplicate it.
 */

import { useSyncExternalStore } from "react";
import type { SceneNodeId } from "./scene-config";

export interface TopologyState {
  /** Node under direct scene pointer hover (Phase 1 behavior). */
  readonly hoverNode: SceneNodeId | null;
  /** Nodes emphasized because a library artifact points at them. */
  readonly focusNodes: readonly SceneNodeId[];
  /** Artifact id that owns the current focus ("" = none). */
  readonly focusArtifactId: string;
}

const NO_NODES: readonly SceneNodeId[] = [];

let state: TopologyState = {
  hoverNode: null,
  focusNodes: NO_NODES,
  focusArtifactId: "",
};

const listeners = new Set<() => void>();

function emit(next: TopologyState) {
  state = next;
  listeners.forEach((listener) => listener());
}

/** Scene pointer hover (drives label + connected-edge brighten). */
export function setHoverNode(id: SceneNodeId | null) {
  if (state.hoverNode !== id) emit({ ...state, hoverNode: id });
}

/**
 * Library-driven focus: emphasize `nodes`, dim the rest.
 * Arrays are expected to be stable module constants (artifact data), which
 * keeps snapshots referentially stable across renders.
 */
export function setArtifactFocus(
  nodes: readonly SceneNodeId[],
  artifactId: string,
) {
  if (state.focusArtifactId === artifactId) return;
  emit({ ...state, focusNodes: nodes, focusArtifactId: artifactId });
}

/** Clear focus only if it still belongs to this artifact. */
export function clearArtifactFocus(artifactId: string) {
  if (state.focusArtifactId !== artifactId) return;
  emit({ ...state, focusNodes: NO_NODES, focusArtifactId: "" });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): TopologyState {
  return state;
}

export function useTopologyState(): TopologyState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
