"use client";

import { useEffect, useState } from "react";

export interface SceneSettings {
  /** prefers-reduced-motion: render one static frame, no ambient motion. */
  reducedMotion: boolean;
  /** Compact (mobile / narrow) layout: fewer pulses, lower DPR. */
  compact: boolean;
  /** Fine pointer (mouse): enables camera parallax + hover affordances. */
  pointerFine: boolean;
}

const INITIAL: SceneSettings = {
  reducedMotion: false,
  compact: false,
  pointerFine: true,
};

/**
 * Media-query-driven scene settings, kept in one hook so the scene reacts
 * to device changes (rotation, OS motion setting) without remounting.
 */
export function useSceneSettings(): SceneSettings {
  const [settings, setSettings] = useState<SceneSettings>(INITIAL);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCompact = window.matchMedia("(max-width: 767px)");
    const mqFine = window.matchMedia("(pointer: fine)");

    const update = () =>
      setSettings({
        reducedMotion: mqReduce.matches,
        compact: mqCompact.matches,
        pointerFine: mqFine.matches,
      });

    update();

    const queries = [mqReduce, mqCompact, mqFine];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return settings;
}
