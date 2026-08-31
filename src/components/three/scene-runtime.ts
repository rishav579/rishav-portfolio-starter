"use client";

/**
 * Scene render-loop singletons (Phase 11B).
 *
 * Two plain mutable objects shared INSIDE the hero scene island:
 *
 * - the assembly timeline — the one-time entrance clock. `birth` is set on
 *   the first rendered frame; every node/edge derives its entrance progress
 *   from it. Plays exactly once per page load, never on scroll.
 * - the feedback signal — the per-frame VERIFY → RETRIEVE arrival envelope
 *   (0..1), written by the feedback edge and read by the RETRIEVE node to
 *   acknowledge each arrival.
 *
 * They deliberately live at module scope rather than flowing through props:
 * the React Compiler forbids mutating prop-received (or imported) objects
 * inside components, so all access is encapsulated in the functions below —
 * components call functions, exactly like the topology store's setters.
 * These are render-loop scratch for a singleton WebGL island, not app
 * state; the one shared semantic state system remains the topology store.
 *
 * The scene is mounted exactly once (lazy island in the hero), so the
 * singletons have exactly one writer/reader family. A hypothetical remount
 * simply finds the assembly already complete — the entrance never replays,
 * by design.
 */

import type { SceneTimeline } from "./scene-config";

const timeline: SceneTimeline = { birth: null };
const feedbackValue = { value: 0 };

/** First rendered frame claims the assembly birth time (idempotent). */
export function markSceneBirth(t: number): void {
  if (timeline.birth === null) timeline.birth = t;
}

/** Seconds elapsed since the first rendered frame (0 before it). */
export function sceneAge(t: number): number {
  return timeline.birth === null ? 0 : t - timeline.birth;
}

/** FeedbackEdge writes the VERIFY → RETRIEVE arrival envelope (0..1). */
export function writeFeedbackSignal(value: number): void {
  feedbackValue.value = value;
}

/** RETRIEVE reads the envelope to acknowledge each arrival. */
export function readFeedbackSignal(): number {
  return feedbackValue.value;
}
