"use client";

import dynamic from "next/dynamic";

/**
 * The single client-side boundary for the WebGL scene.
 *
 * `./scene` renders the React Three Fiber system topology. It is code-split,
 * client-only (excluded from SSR/SSG), and the only place in the app where
 * three.js is imported. The loading fallback covers the chunk fetch; the
 * Canvas-level `fallback` covers missing WebGL support.
 */
const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(90%_75%_at_62%_38%,oklch(0.17_0.02_260/0.5),transparent_72%)]"
    />
  );
}

export function SceneSlot() {
  return <Scene />;
}
