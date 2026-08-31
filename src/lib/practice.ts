/**
 * Practice Index — AI Engineering section data (PROVENANCE, Phase 8).
 *
 * Server-safe module (pure data, no React). It re-reads the five verified
 * records in artifacts.ts through a role/capability lens: the career
 * positioning layer of the archive. It adds no new claims — every evidence
 * reference resolves to an existing VERIFIED record, and a reference can
 * only be authored against a known artifact id (compile-time) that exists
 * and is verified (runtime guard below).
 *
 * CONTENT RULES (hard):
 * - Mappings derive from the audited dossier content in artifacts.ts
 *   (implementation and executed verification), not from technology lists.
 * - A deliberate non-claim is preserved: Meridian Market's assistant is a
 *   single grounded generation step, so it never maps to agentic capability;
 *   Demand-Risk carries no LLM, so it never maps to LLM capability.
 * - Qualifiers stay explicit where the record itself is qualified
 *   (RR-SYS-005 retrieval is "RAG-lite" — scored catalog matching).
 * - The primary direction (AI Engineer) is kept in the data as role 01; the
 *   section renders it as the dominant statement, not as an equal card.
 */

import { ARTIFACTS } from "@/lib/artifacts";

/* ------------------------------ artifact ids ------------------------------ */

const ARTIFACT_IDS = [
  "repopilot",
  "ownara-ai",
  "enterprise-ai-investigation",
  "demand-risk-engine",
  "meridian-market",
] as const;

export type ArtifactId = (typeof ARTIFACT_IDS)[number];

/* -------------------------------- ref model ------------------------------- */

export interface PracticeEvidenceRef {
  readonly artifact: ArtifactId;
  /** Supporting references render muted with an explicit "also" prefix. */
  readonly supporting?: boolean;
  /** Explicit qualifier rendered beside the reference (e.g. "RAG-lite"). */
  readonly qualifier?: string;
}

export interface ResolvedEvidenceRef {
  readonly artifactId: string;
  readonly accessionId: string;
  readonly title: string;
  readonly supporting: boolean;
  readonly qualifier?: string;
}

export interface ResolvedPracticeRole {
  readonly id: string;
  readonly title: string;
  /** One-line scope note rendered under the role title. */
  readonly note: string;
  readonly evidence: readonly ResolvedEvidenceRef[];
}

export interface ResolvedPracticeCapability {
  readonly id: string;
  readonly label: string;
  readonly evidence: readonly ResolvedEvidenceRef[];
}

/* ------------------------------- resolution ------------------------------- */

function resolveEvidence(
  evidence: readonly PracticeEvidenceRef[],
): readonly ResolvedEvidenceRef[] {
  const byId = new Map(ARTIFACTS.map((artifact) => [artifact.id, artifact]));
  return evidence.flatMap((ref): ResolvedEvidenceRef[] => {
    const artifact = byId.get(ref.artifact);
    // Reserved or unknown records can never back a capability claim.
    if (!artifact || artifact.status !== "VERIFIED") return [];
    return [
      {
        artifactId: artifact.id,
        accessionId: artifact.accessionId,
        title: artifact.title,
        supporting: ref.supporting ?? false,
        qualifier: ref.qualifier,
      },
    ];
  });
}

/* ------------------------------ role model -------------------------------- */

interface PracticeRoleSource {
  readonly id: string;
  readonly title: string;
  readonly note: string;
  readonly evidence: readonly PracticeEvidenceRef[];
}

/**
 * Role 01 — the primary direction. Rendered by the section as the dominant
 * statement; evidence spans all five verified systems because each is an
 * end-to-end AI-bearing product with a serving surface, verification, and
 * disclosed limitations.
 */
const PRIMARY_DIRECTION_SOURCE: PracticeRoleSource = {
  id: "ai-engineer",
  title: "AI Engineer",
  note: "Builds AI-powered software end to end — retrieval, generation, machine learning, and agents inside systems with serving layers, executed tests, and disclosed limits.",
  evidence: [
    { artifact: "repopilot" },
    { artifact: "ownara-ai" },
    { artifact: "demand-risk-engine" },
    { artifact: "enterprise-ai-investigation" },
    { artifact: "meridian-market" },
  ],
};

/**
 * Supporting role directions 01–04. AI Engineer stays out of this list —
 * it is the primary direction above, never an equal card.
 */
const ROLE_DIRECTION_SOURCES: readonly PracticeRoleSource[] = [
  {
    id: "genai-llm-engineer",
    title: "Generative AI / LLM Engineer",
    // Phase 11D copy pass: same facts as the records, plain wording that
    // reads at first pass. The technical detail stays in the dossiers.
    note: "LLM features that answer from real sources — context retrieved into the prompt, citations checked before display, and honest fallbacks when the sources don't support an answer.",
    evidence: [
      { artifact: "repopilot" },
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
      { artifact: "meridian-market" },
    ],
  },
  {
    id: "applied-ai-engineer",
    title: "Applied AI Engineer",
    note: "Machine learning for real decisions — data split by time to prevent leakage, results compared against simple baselines, and evaluation numbers published with the work.",
    evidence: [
      { artifact: "demand-risk-engine" },
      { artifact: "repopilot", supporting: true },
      { artifact: "enterprise-ai-investigation", supporting: true },
    ],
  },
  {
    id: "agentic-ai-engineer",
    title: "Agentic AI Engineer",
    note: "AI agents that use tools safely — every action approved and logged, with hard limits that keep autonomy under control.",
    evidence: [
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
    ],
  },
  {
    id: "ai-software-engineer",
    title: "AI Software Engineer",
    note: "The engineering around the models — typed APIs, dependable state handling, authentication, realtime updates, and tests that actually run.",
    evidence: [
      { artifact: "repopilot" },
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
      { artifact: "meridian-market" },
    ],
  },
];

/* ---------------------------- capability model ---------------------------- */

interface PracticeCapabilitySource {
  readonly id: string;
  readonly label: string;
  readonly evidence: readonly PracticeEvidenceRef[];
}

const CAPABILITY_SOURCES: readonly PracticeCapabilitySource[] = [
  {
    id: "rag-retrieval",
    label: "RAG & Retrieval",
    evidence: [
      { artifact: "repopilot" },
      { artifact: "enterprise-ai-investigation" },
      // Kept only with the record's own explicit qualifier: RAG-lite.
      { artifact: "meridian-market", supporting: true, qualifier: "RAG-lite" },
    ],
  },
  {
    id: "llm-applications",
    label: "LLM Applications",
    evidence: [
      { artifact: "repopilot" },
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
      { artifact: "meridian-market" },
    ],
  },
  {
    id: "agentic-workflows",
    label: "Agentic Workflows & Tool Use",
    evidence: [
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
    ],
  },
  {
    id: "applied-machine-learning",
    label: "Applied Machine Learning",
    evidence: [{ artifact: "demand-risk-engine" }],
  },
  {
    id: "python-backend",
    label: "Python / Backend Engineering",
    evidence: [
      { artifact: "repopilot" },
      { artifact: "demand-risk-engine" },
      { artifact: "enterprise-ai-investigation" },
    ],
  },
  {
    id: "ai-native-fullstack",
    label: "AI-Native Full-Stack Development",
    evidence: [
      { artifact: "ownara-ai" },
      { artifact: "enterprise-ai-investigation" },
      { artifact: "meridian-market" },
      // Supporting: the record's React console + FastAPI backend + CI are
      // real, but its center of gravity is retrieval engineering.
      { artifact: "repopilot", supporting: true },
    ],
  },
  {
    id: "data-intelligent-systems",
    label: "Data & Intelligent Systems",
    evidence: [
      { artifact: "demand-risk-engine" },
      { artifact: "ownara-ai", supporting: true },
      { artifact: "enterprise-ai-investigation", supporting: true },
    ],
  },
];

/* ------------------------------- exports ---------------------------------- */

export const PRIMARY_DIRECTION: ResolvedPracticeRole = {
  ...PRIMARY_DIRECTION_SOURCE,
  evidence: resolveEvidence(PRIMARY_DIRECTION_SOURCE.evidence),
};

export const ROLE_DIRECTIONS: readonly ResolvedPracticeRole[] =
  ROLE_DIRECTION_SOURCES.map((role) => ({
    ...role,
    evidence: resolveEvidence(role.evidence),
  }));

export const CAPABILITIES: readonly ResolvedPracticeCapability[] =
  CAPABILITY_SOURCES.map((capability) => ({
    ...capability,
    evidence: resolveEvidence(capability.evidence),
  }));
