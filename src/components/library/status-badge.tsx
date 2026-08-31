import type { ArtifactStatus } from "@/lib/artifacts";

/**
 * Archive status plate — VERIFIED (audited) / RESERVED (future slot).
 *
 * Phase 11C ink consistency: both states are flat ink stamps — no tinted
 * fill behind either — so the two read as the same object in different
 * inks. VERIFIED carries the accent ink and a solid dot (audited record);
 * RESERVED carries quiet ink and a hollow dot (an empty slot), matching
 * the dashed ReservedRow rule it sits in. Semantics unchanged.
 */
export function StatusBadge({ status }: { status: ArtifactStatus }) {
  const verified = status === "VERIFIED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${
        verified
          ? "border-accent-cyan/45 text-accent-cyan"
          : "border-foreground/20 text-muted-foreground"
      }`}
    >
      <span
        aria-hidden="true"
        className={
          verified
            ? "h-1 w-1 rounded-full bg-accent-cyan"
            : "h-1.5 w-1.5 rounded-full border border-muted-foreground/70"
        }
      />
      {status}
    </span>
  );
}
