"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

/**
 * Copy-email affordance (Phase 11D) — the one genuinely useful clipboard
 * action in the archive: an email address. The mailto row stays the primary
 * interaction; this is a quiet secondary control for people whose mail is
 * webmail (copy, paste, send from there).
 *
 * Contract: 44px touch target, keyboard reachable, explicit visible
 * "Copied" feedback with an sr-only live-region announcement, and a legacy
 * execCommand fallback for non-secure contexts AND for secure contexts
 * where the Clipboard API is present but rejects the write (e.g. hidden
 * iframes, in-app browsers). "Copy failed" only appears when both paths
 * fail. Feedback state reverts on its own; the timer is cleaned up on
 * unmount. Rendering is identical in SSR and client (no layout shift);
 * without JavaScript the button is inert — the same graceful degradation
 * as every other control in the client islands — and the mailto link
 * beside it keeps working.
 */
export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const flash = (next: CopyState) => {
    setState(next);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setState("idle"), 2400);
  };

  // Legacy path: works in non-secure contexts and inside hidden iframes
  // where the async Clipboard API refuses writes. Returns success boolean.
  const legacyCopy = (): boolean => {
    const area = document.createElement("textarea");
    area.value = email;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  };

  const onCopy = async () => {
    // Primary path: async Clipboard API (secure contexts). If it is absent
    // or REJECTS (NotAllowedError — e.g. LinkedIn in-app browsers, strict
    // webviews), fall through to the legacy path instead of failing.
    if (typeof navigator.clipboard?.writeText === "function") {
      try {
        await navigator.clipboard.writeText(email);
        flash("copied");
        return;
      } catch {
        // Rejected — try the legacy path below.
      }
    }
    try {
      flash(legacyCopy() ? "copied" : "error");
    } catch {
      flash("error");
    }
  };

  const label =
    state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy";

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy email address (${email})`}
        className={`mr-2 inline-flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 border px-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 sm:mr-3 ${
          state === "copied"
            ? "border-accent-cyan/50 text-accent-cyan"
            : state === "error"
              ? "border-foreground/30 text-muted-foreground"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
        }`}
      >
        {state === "copied" ? (
          <Check className="size-3.5" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
        <span>{label}</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Email address copied to clipboard" : state === "error" ? "Copy failed" : ""}
      </span>
    </>
  );
}
