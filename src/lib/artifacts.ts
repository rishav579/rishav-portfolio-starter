/**
 * Engineering Library — artifact data model and records.
 *
 * Server-safe module (pure data, no React). The library section is rendered
 * from this module on the server; the client island only receives it as props.
 *
 * CONTENT RULES (hard):
 * - Every claim below is audited against the linked repository.
 *   · RR-SYS-001 RepoPilot — github.com/rishav579/repo-pilot
 *     (README, docs/DECISIONS.md, docs/ARCHITECTURE.md).
 *   · RR-SYS-002 OWNARA-AI — github.com/rishav579/OWNARA-AI
 *     (README, prisma/schema.prisma, src/lib/{runtime,mandate,llm}, package.json
 *     test scripts) plus a hands-on check of the live Railway deployment on
 *     28 Aug 2026 (demo provisioning → delegation → approval gate → execution
 *     → audit timeline), captured in the linked screenshots.
 *   · RR-SYS-004 Enterprise AI Investigation —
 *     github.com/rishav579/enterprise-ai-investigation. Verified hands-on on
 *     30 Aug 2026: backend (207 pytest), frontend (32 vitest), and golden
 *     evaluation (6/6) suites executed locally; real-model end-to-end runs
 *     (GLM-4-plus behind the repository's LLMProvider interface, repository
 *     unmodified) including the citation-validated churn investigation, the
 *     zero-fabrication refusal path, and live SQL-mutation/path-traversal
 *     rejection — captured in the linked screenshots. Test counts in the
 *     record are executed results, not repository claims.
 *   · RR-SYS-003 Demand-Risk Intelligence Engine —
 *     github.com/rishav579/Real-Time-Demand-Risk-Intelligence-Engine.
 *     Verified hands-on on 30 Aug 2026: the full pytest suite executed
 *     locally (119 passed — the README's "117 tests" claim is stale), the
 *     ingestion run executed its 40-check quality gate live (40/40 PASS),
 *     and the complete pipeline (marts → chronological splits → LightGBM +
 *     baselines benchmark → runout simulation → safety stock/ROP → risk
 *     scoring → attribution → prescriptive recommendations) was executed
 *     end-to-end, reproducing every published headline number exactly
 *     (WAPE 0.1097 vs Naive 0.2152; tiers 26/8/8/33; 48 recommendations =
 *     12 DC transfers + 29 POs + 7 holds). FastAPI and the Streamlit
 *     dashboard ran locally; all linked screenshots are live captures.
 *     Test counts, WAPE figures, and tier/action counts in the record are
 *     executed results, not repository claims.
 *   · RR-SYS-005 Meridian Market — github.com/rishav579/meridian-market.
 *     Verified hands-on on 30 Aug 2026: the full Vitest suite executed locally
 *     (75/75 across 7 suites — executed result matches the README claim), and
 *     the running application was driven end-to-end over HTTP and in a browser:
 *     guest checkout settled PAID through the self-delivered HMAC-signed
 *     webhook, idempotent replay returned the same order with stock decremented
 *     exactly once, two concurrent checkouts on stock=1 produced exactly one
 *     201 and one rolled-back 409, tampered/stale/unsigned webhooks were
 *     rejected, the admin PAID override was refused (403), CSRF and rate
 *     limits held, the AI assistant answered with the real LLM grounded in the
 *     live catalog (degraded: false) and the deterministic fallback was
 *     exercised by the suite, and a guest order appeared on the vendor
 *     dashboard live over socket.io through the platform gateway. The two
 *     storefront figures are the repository's committed screenshots; the
 *     other four are live captures from this verification run.
 * - No metrics, clients, production usage, employment, or expertise claims are
 *   invented. Reserved records are explicit placeholders for future artifacts.
 * - Benchmark figures from repository READMEs are described, not republished:
 *   they are the project's own published results. Demo-workspace figures visible
 *   in OWNARA screenshots are seeded demo data, not business results.
 */

import { NODES, type SceneNodeId } from "@/components/three/scene-config";

/* ------------------------------- collections ------------------------------ */

export type CollectionId =
  | "ai-genai"
  | "ai-native-fullstack"
  | "data-ml-systems"
  | "engineering-exercises";

export interface Collection {
  readonly id: CollectionId;
  /** Archive index code, e.g. "C.01". */
  readonly index: string;
  readonly label: string;
  readonly tagline: string;
}

export const COLLECTIONS: readonly Collection[] = [
  {
    id: "ai-genai",
    index: "C.01",
    label: "AI & Generative AI",
    tagline: "LLM applications, RAG pipelines, and grounded generation systems.",
  },
  {
    id: "ai-native-fullstack",
    index: "C.02",
    label: "AI-Native Full-Stack",
    tagline: "End-to-end products designed around an AI core — API to UI.",
  },
  {
    id: "data-ml-systems",
    index: "C.03",
    label: "Data / ML Systems",
    tagline: "Indexes, evaluation harnesses, and applied machine-learning plumbing.",
  },
  {
    id: "engineering-exercises",
    index: "C.04",
    label: "Engineering Exercises",
    tagline: "Deliberate practice: focused builds that sharpen specific mechanics.",
  },
];

/* ------------------------------ artifact model ---------------------------- */

export type ArtifactStatus = "VERIFIED" | "RESERVED";

export interface ArtifactFigure {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  /** Intrinsic pixel size for next/image. */
  readonly width: number;
  readonly height: number;
}

export interface ArtifactLink {
  readonly label: string;
  readonly href: string;
  readonly kind: "repository" | "docs" | "live";
}

export interface ArtifactDecision {
  /**
   * Stable label for the decision — a real decision-record identifier from the
   * repository (e.g. "ADR-001", or an in-code design reference such as
   * "DDS-001") or a topical label where decisions are documented in source.
   */
  readonly id: string;
  readonly title: string;
  readonly rationale: string;
}

/**
 * Full record for a documented artifact. Every section is written from
 * verified repository evidence — placeholders simply omit the dossier.
 */
export interface ArtifactDossier {
  readonly overview: string;
  readonly problem: string;
  /** Motivation in the author's voice. Optional — omitted where not applicable. */
  readonly whyBuilt?: string;
  /** What the delivered system is, in one dense paragraph. Optional. */
  readonly system?: string;
  /** Layer-by-layer architecture summary. */
  readonly architecture: readonly string[];
  /** End-to-end agent/tool loop, step by step. Optional (agent systems). */
  readonly aiAgentWorkflow?: readonly string[];
  readonly technicalDecisions: readonly ArtifactDecision[];
  readonly implementation: readonly string[];
  readonly verification: readonly string[];
  /** May be empty — figure plates are shown as explicitly reserved. */
  readonly figures: readonly ArtifactFigure[];
  readonly limitations: readonly string[];
  readonly links: readonly ArtifactLink[];
  /** Honest attribution note rendered with the verification section. */
  readonly verificationNote?: string;
  /** Footnote under the decisions grid. Falls back to the ADR wording. */
  readonly technicalDecisionsNote?: string;
}

export interface EngineeringArtifact {
  readonly id: string;
  readonly accessionId: string;
  readonly title: string;
  readonly type: "system" | "exercise";
  /** Display label, e.g. "AI / Developer Tooling". */
  readonly categoryLabel: string;
  readonly collections: readonly CollectionId[];
  readonly description: string;
  readonly technologies: readonly string[];
  readonly status: ArtifactStatus;
  /** Subsystem nodes this artifact touches in the hero topology. */
  readonly topologyNodes: readonly SceneNodeId[];
  /** True for explicit reserved placeholder rows (non-interactive). */
  readonly reserved?: boolean;
  readonly dossier?: ArtifactDossier;
}

/* ------------------------------ pipeline labels --------------------------- */

const NODE_LABELS = Object.fromEntries(
  NODES.map((node) => [node.id, node.label.toUpperCase()]),
) as Record<SceneNodeId, string>;

/** ["INPUT", "INGEST", …] for display chips — readable without WebGL. */
export function pipelineLabels(nodes: readonly SceneNodeId[]): string[] {
  return nodes.map((id) => NODE_LABELS[id]);
}

/* --------------------------------- records -------------------------------- */

const REPOPILOT: EngineeringArtifact = {
  id: "repopilot",
  accessionId: "RR-SYS-001",
  title: "RepoPilot",
  type: "system",
  categoryLabel: "AI / Developer Tooling",
  collections: ["ai-genai", "ai-native-fullstack"],
  description:
    "Grounded repository Q&A engine — parses codebases into AST symbol trees, indexes them for hybrid retrieval, and answers natural-language questions with citation-verified evidence.",
  technologies: ["FastAPI", "Tree-sitter", "SQLite FTS5", "RAG"],
  status: "VERIFIED",
  topologyNodes: ["input", "ingest", "compute", "retrieve", "generate", "verify"],
  dossier: {
    overview:
      "RepoPilot is a full-stack AI engineering platform that turns a local code repository into a queryable, evidence-backed knowledge base. It parses source files into AST symbol trees, indexes them into keyword and vector stores, and answers natural-language questions about the codebase with citations pointing at exact file paths, symbols, and line ranges. The repository presents itself plainly as an educational, portfolio-scale project designed and implemented from scratch — built to demonstrate production-minded AI engineering, not sold as a commercial product.",
    problem:
      "Engineers onboarding into a large, unfamiliar codebase lose days manually opening files — mapping the architecture, tracing symbol dependencies, and hunting for the logic that matters. Generic LLM chat makes this worse: answers arrive fluently but without evidence, and a hallucinated API reference costs more time than it saves. RepoPilot's premise is that code questions deserve verifiable answers — every claim grounded in retrieved, cited source, with an explicit refusal when the evidence is not there.",
    architecture: [
      "Frontend — React 19 + TypeScript + Vite developer dashboard: repository registration, a query console, and an answer/evidence panel with citation cards.",
      "API layer — FastAPI gateway with typed Pydantic contracts exposing repository, retrieval, and RAG endpoints.",
      "Ingestion & parsing — repository scanner with path validation, feeding a Tree-sitter parser that extracts functions, classes, and symbol metadata for Python, TypeScript, and JavaScript.",
      "Indexing — a SQLite FTS5 keyword index beside SQLite vector storage of FastEmbed sentence embeddings; every chunk is isolated per repository.",
      "Retrieval — hybrid search fusing BM25 and dense similarity through Reciprocal Rank Fusion, then re-scored by a deterministic code-aware reranker (exact symbols, filenames, route decorators, signatures, docstrings).",
      "Generation — grounded prompt assembly over retrieved evidence, a pluggable LLM provider (mock + OpenAI), bracketed citation verification, and an INSUFFICIENT_EVIDENCE refusal path.",
    ],
    technicalDecisions: [
      {
        id: "ADR-001",
        title: "Python + FastAPI backend",
        rationale:
          "First-class AI/ML ecosystem access, async I/O for LLM calls, and typed request validation via Pydantic.",
      },
      {
        id: "ADR-002",
        title: "React + TypeScript + Vite frontend",
        rationale:
          "A type-safe developer-tool UI with fast iteration against the API contracts.",
      },
      {
        id: "ADR-003",
        title: "SQLite first, PostgreSQL + pgvector later",
        rationale:
          "Zero-dependency, offline-capable hybrid search now — with a documented scaling path instead of premature infrastructure.",
      },
      {
        id: "ADR-004",
        title: "Tree-sitter for code parsing",
        rationale:
          "Language-agnostic structural parsing of real syntax instead of regex heuristics.",
      },
      {
        id: "ADR-005",
        title: "Pluggable LLM provider",
        rationale:
          "A mock provider keeps the entire RAG pipeline testable offline; OpenAI drops in without touching pipeline code.",
      },
      {
        id: "ADR-006",
        title: "Hybrid retrieval + deterministic rerank",
        rationale:
          "BM25 and dense embeddings cover each other's blind spots; the code-aware reranker adds precision without ML inference latency.",
      },
    ],
    implementation: [
      "Repository lifecycle management — register, scan, parse, and index with explicit status tracking: REGISTERED → INDEXING → READY / FAILED.",
      "Hybrid index built on SQLite FTS5 (BM25 keyword search) and FastEmbed sentence-transformers/all-MiniLM-L6-v2 dense vectors.",
      "Grounded answer assembly with bracketed citations [1] [2], each checked against the retrieved evidence set before it reaches the UI.",
      "Defensive prompt design — untrusted retrieved code is wrapped in tagged evidence fences with strict instructions against executing embedded directives.",
      "Multi-stage Docker images, Compose orchestration, and a GitHub Actions pipeline running lint, backend tests, frontend tests, and builds.",
    ],
    verification: [
      "An offline evaluation harness measures Recall@K, MRR, grounded-answer rate, citation validity, and insufficient-evidence precision across keyword, semantic, and hybrid retrieval modes — results are published in the repository README.",
      "Backend pytest suite — 138 unit and integration tests as documented in the repository structure.",
      "Frontend Vitest suite and production build checks wired into the CI pipeline.",
      "The documented demo workflow deliberately includes an unanswerable question, exercising the refusal path — the system is expected to decline rather than hallucinate.",
    ],
    verificationNote:
      "Benchmark figures are the repository's own published results and are intentionally not republished here as independent claims.",
    figures: [
      {
        src: "/artifacts/repo-pilot/repo-mark.png",
        alt: "RepoPilot repository brand graphic — isometric outlined plates over a violet base",
        caption:
          "Repository brand graphic (frontend/src/assets/hero.png). The repository does not yet publish UI captures — figure plates are reserved for authentic screenshots.",
        width: 343,
        height: 361,
      },
    ],
    limitations: [
      "Persistence is local SQLite; on ephemeral hosts without volume mounts, repository state resets when the container restarts.",
      "Ingestion targets local directories — registration and indexing assume filesystem access rather than remote repository cloning.",
      "With the OpenAI provider enabled, answer quality and latency depend on an external service; the mock provider exists for offline testing.",
      "Evaluation runs against curated offline cases — a reproducible engineering benchmark, not a public-user study.",
    ],
    links: [
      {
        label: "github.com/rishav579/repo-pilot",
        href: "https://github.com/rishav579/repo-pilot",
        kind: "repository",
      },
      {
        label: "docs/ARCHITECTURE.md",
        href: "https://github.com/rishav579/repo-pilot/blob/main/docs/ARCHITECTURE.md",
        kind: "docs",
      },
      {
        label: "docs/DECISIONS.md",
        href: "https://github.com/rishav579/repo-pilot/blob/main/docs/DECISIONS.md",
        kind: "docs",
      },
    ],
  },
};

const OWNARA: EngineeringArtifact = {
  id: "ownara-ai",
  accessionId: "RR-SYS-002",
  title: "OWNARA-AI",
  type: "system",
  categoryLabel: "Agentic AI / Business Operations",
  collections: ["ai-genai", "ai-native-fullstack"],
  description:
    "Governed AI execution system — persistent AI-operator mandates with authority boundaries, hashed Execution Contracts behind a human approval gate, and a hash-chained audit ledger. First operator: Kavya, an AI accounts-receivable operator.",
  technologies: ["Next.js 16", "React 19", "PostgreSQL", "Prisma", "LLM gateway"],
  status: "VERIFIED",
  topologyNodes: ["input", "generate", "verify", "application"],
  dossier: {
    overview:
      "OWNARA gives an AI operator a persistent business responsibility — a Mandate — instead of a one-off prompt: a declared objective with explicit authority boundaries, human approval for consequential actions, and a tamper-evident execution trail. The first implemented operator is Kavya, an AI accounts-receivable operator for B2B collections, who continuously evaluates receivables state, proposes recovery actions, halts at a human approval gate, executes what is approved, and records every step. The repository describes itself as an active portfolio prototype — an architecture study in governed AI execution, not a commercial collections product.",
    problem:
      "The hard part of AI in business operations is not drafting the email — it is everything around it. Nothing bounds what the system may do, nothing forces a review before a consequential action, and nothing reliably records what actually happened afterwards. A fluent agent with send access and no ledger is unverifiable and unaccountable. OWNARA starts from a different question than capability: can an AI system be trusted with a persistent business responsibility? It answers by making authority, approval, and audit first-class architectural primitives.",
    whyBuilt:
      "Most agent projects optimize what the model can do. I wanted to build the layer around the model — the separation between what the business wants, what the AI recommends, what it is authorized to do, what requires human approval, what was executed, and what happened afterward. Accounts receivable was a deliberate proving ground: every action is consequential (real customers, real money), the desired state is machine-checkable, and success is measurable — so the governance layer has to actually work rather than decorate the demo.",
    system:
      "A two-service application over PostgreSQL: a Next.js 16 / React 19 web service (operator surfaces — dashboard, mandates, delegate-work, tasks, employees, Decision Center, receivables, Trust Center, audit timeline — plus ~40 API route groups with JWT auth) and a Node.js background worker that runs the Mandate Supervisor, executes task steps, and processes audit writes. LLM calls flow through a multi-provider gateway (Gemini default, OpenAI and Anthropic adapters, deterministic mock fallback) wrapped in input/output guardrails. Data lives in 45 Prisma models covering mandates, tasks, approvals, execution contracts, trust scores, and the finance domain.",
    architecture: [
      "Web application — Next.js 16 + React 19: landing, JWT auth, dashboard, delegate-work, mandates, tasks, employee profiles, Decision Center, receivables, Trust Center, communication threads, and the audit timeline.",
      "API layer — ~40 Next.js route groups: auth (access/refresh rotation, rate-limited login), approvals, audit + chain verification, mandates, tasks, employees, finance, governance policies/rules, communications, knowledge, integrations, onboarding.",
      "Mandate engine — persistent objectives with declaration, machine-checkable success criteria (e.g. overdueRate <= 0.15), a versioned authority spec, and computed health scores.",
      "Mandate supervisor — a poll-cycle loop (observe → reason → act → learn) that spawns execution episodes when observed state misses the target; interval-guarded and capped at one concurrent episode per mandate to prevent flooding.",
      "Strategy selection — reads the live domain state (aging buckets, risk profiles, disputes, promises, responsiveness) and chooses an episode type — investigate disputed, prioritize high-value, reminder campaign, wait-for-promise, escalate unresponsive, or re-evaluate — with the reasoning and memory references recorded.",
      "Execution runtime — a planner produces typed step plans; the executor runs steps with per-step logging (confidence, tokens), halts tasks at approval gates, and executes approved actions through the communication layer (transactional SMTP; documented mock transport when SMTP is unconfigured).",
      "LLM gateway — provider adapters behind one interface with input guardrails (prompt-injection patterns, forbidden-tool references, policy checks) and output guardrails (PII patterns, approval-bypass instructions), plus caching, logging, and usage records.",
      "Data & audit — PostgreSQL via Prisma (45 models); the AuditLog is append-only and hash-chained per workspace — monotonic sequence numbers, SHA-256 linkage, advisory-lock serialization, and entries written inside the same transaction as the state they record.",
    ],
    aiAgentWorkflow: [
      "Observe — the supervisor reads receivables state: invoice aging, customer credit profiles, payment history, and prior reminder responses.",
      "Reason — observed state is compared against the mandate's success criteria; a strategy selector picks the episode type and records why, influenced by accumulated mandate memory.",
      "Plan — the runtime planner turns the strategy into a concrete step plan (review invoices, assess customers, draft reminders, send, update cases).",
      "Execute with explainability — each executed step is logged in the task timeline with a reasoning summary, confidence score, and token accounting.",
      "Approval gate — consequential tools (e.g. send_reminder) generate a canonical, versioned Execution Contract (hashed, with authority context and expected effect) and the task halts in waiting_approval until a human approves, modifies, or rejects.",
      "Execute — approved actions run through the communication layer and update collection cases; the outcome is attributed to the operator.",
      "Audit & learn — every step, decision, approval, and execution is appended to the hash-chained ledger; a learning engine evaluates completed episodes and the accumulated memory feeds the next strategy selection.",
    ],
    technicalDecisions: [
      {
        id: "DDS-001",
        title: "Append-only, hash-chained audit ledger",
        rationale:
          "Every runtime action appends an audit entry inside the same database transaction as the state change it records — per-workspace monotonic sequence numbers, SHA-256 chaining to the previous entry, and advisory-lock serialization. Tampering is detectable by re-hashing the chain.",
      },
      {
        id: "BED-001",
        title: "Approval gates halt execution",
        rationale:
          "A consequential step becomes an approval_gate: the executor persists the proposed action, moves the task to waiting_approval, and stops — no email leaves until a human decides. Execution resumes only from an approved contract.",
      },
      {
        id: "AUTHORITY",
        title: "Mandate authority overrides capability",
        rationale:
          "resolveEffectiveAuthority() evaluates the mandate's authority spec before employee tool whitelists: an action forbidden at mandate level is always blocked; approval-required at mandate level always gates. Employee capability can never widen authority.",
      },
      {
        id: "PROVIDERS",
        title: "Multi-provider gateway with deterministic fallback",
        rationale:
          "Gemini, OpenAI, and Anthropic adapters sit behind one gateway with guardrails, caching, and usage logging. A deterministic mock provider keeps the entire governed pipeline testable offline — governance logic does not depend on a live model.",
      },
    ],
    technicalDecisionsNote:
      "Decision summaries traced to the implementation and in-code design references (DDS-001, BED-001); the repository does not publish a separate ADR document.",
    implementation: [
      "JWT authentication with access/refresh rotation, hashed session tokens, workspace membership, and rate-limited login (10 attempts/min/IP).",
      "Idempotent demo-provisioning endpoint that seeds a complete demo company — customers with GSTIN/payment terms, invoices across aging buckets, and Kavya configured with a tool whitelist and approval rules — returning existing credentials if the workspace already exists.",
      "CSV import for customers and invoices with field validation (GSTIN format, payment terms, dates).",
      "Trust scoring and capability tracking per AI employee, communication threads between operators and humans, notifications, and a governance layer of policies and approval rules.",
      "Railway deployment as separate web and worker services — Dockerfile, Procfile, tracked Prisma migrations applied on release — with a documented operator checklist (docs/RAILWAY-DEPLOYMENT.md, docs/PILOT-CHECKLIST.md).",
    ],
    verification: [
      "Live deployment verified hands-on on 28 Aug 2026: demo workspace provisioning → task delegation → live execution timeline (per-step reasoning, confidence, tokens) → approval gate holding Execution Contract EC-0001 v1 → human approval → execution and collection-case update → hash-chained audit entries; the audit UI reports the chain as verified.",
      "The repository ships script-based verification suites wired as npm scripts: MVP acceptance, authority consistency, authority escalation, approval RBAC, worker idempotency, CSV date parsing, new-customer flow, API-client safety, mandate evaluation scenarios, and staging verification.",
      "A deterministic evaluation engine measures operator behavior across mandate scenarios — task outcomes, authority compliance, decision quality, and skill progression — as described in the repository.",
      "Audit-chain integrity checking is implemented server-side: entries are re-hashed and linkage-verified per workspace, exposed through the audit verify endpoint and surfaced in the UI.",
    ],
    verificationNote:
      "Screenshots are captured from the live deployed prototype running seeded demo data. Demo-workspace figures (recovery estimates, trust scores, KPIs) are illustrative sample data, not real business results. The repository's test suites require a PostgreSQL instance and were not executed during this audit; they are documented from source.",
    figures: [
      {
        src: "/artifacts/ownara-ai/dashboard.webp",
        alt: "OWNARA workspace dashboard — morning brief, Kavya's current status, estimated recovery, and quick actions",
        caption:
          "FIG. 01 — Workspace dashboard right after demo provisioning: morning brief, Kavya's live status, estimated recovery across overdue invoices, and quick actions. Live deployment, seeded demo data.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/task-timeline.webp",
        alt: "OWNARA task timeline showing the planned step budget and reasoned steps with confidence scores",
        caption:
          "FIG. 02 — Task execution timeline (the explainability view): the planner's 20-step finance plan — including 2 flagged critical actions — followed by per-invoice reasoning steps with confidence scores and token accounting.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/task-approval-gate.webp",
        alt: "OWNARA task timeline showing a WAITING_APPROVAL step for send_reminder followed by the approved tool execution",
        caption:
          "FIG. 03 — The approval gate inside the same task: a send_reminder step held in WAITING_APPROVAL as a critical action, then the approved tool execution updating the collection case. Step outputs show the structured payloads.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/decision-center.webp",
        alt: "OWNARA Decision Center showing pending Execution Contract EC-0001 with confidence, risk, expected effect and reasoning",
        caption:
          "FIG. 04 — Decision Center holding Execution Contract EC-0001 v1: the proposed reminder for a 90-day-overdue, high-risk invoice, with confidence, risk score, expected effect, and the full reasoning behind the action.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/audit-timeline.webp",
        alt: "OWNARA audit timeline with hash-chain detail panel showing previous and current entry hashes",
        caption:
          "FIG. 05 — Audit Timeline: the append-only event log for the whole run (delegation → planning → reasoning → approval → send), with entry #17 open showing its hash-chain links and the 'hash chain intact — tamper-evident' check.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/operator-profile.webp",
        alt: "OWNARA operator profile for Kavya listing responsibilities and explicit operating boundaries",
        caption:
          "FIG. 06 — Kavya's operator profile: responsibilities as tool-scoped chips, and explicit operating boundaries — human approval before any customer communication, no invoice modification, escalation after three unanswered reminders.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/ownara-ai/trust-center.webp",
        alt: "OWNARA Trust Center enterprise operations report with business KPIs and employee trust scores",
        caption:
          "FIG. 07 — Trust Center reporting: business KPIs and per-employee trust scores computed from the demo workspace's own event data — the numbers here are seeded sample data, not business results.",
        width: 1440,
        height: 900,
      },
    ],
    limitations: [
      "Portfolio/engineering prototype — the repository explicitly states it is not a production accounting or collections platform, and no real customers or financial outcomes are claimed.",
      "Email execution uses a documented mock transport (status sent_mock) wherever SMTP is unconfigured — which is the state observed on the live deployment during verification.",
      "No live accounting integrations (Tally, Zoho Books, QuickBooks, Stripe); customer and invoice data enters through CSV import.",
      "Document upload metadata exists, but there is no production vector-search/RAG pipeline yet.",
      "Kavya is the only implemented operator; other AI-employee roles (sales, HR, operations) are not implemented as working operators.",
      "The gateway supports Gemini, OpenAI, and Anthropic, but the UI does not surface which provider served a given run — provider attribution for the observed execution could not be confirmed from the outside.",
      "Running locally requires PostgreSQL 16+ and an LLM provider key (Gemini by default); this verification used the live deployment instead of a local instance.",
    ],
    links: [
      {
        label: "Live deployment — Railway",
        href: "https://web-production-be3ab.up.railway.app",
        kind: "live",
      },
      {
        label: "github.com/rishav579/OWNARA-AI",
        href: "https://github.com/rishav579/OWNARA-AI",
        kind: "repository",
      },
      {
        label: "docs/RAILWAY-DEPLOYMENT.md",
        href: "https://github.com/rishav579/OWNARA-AI/blob/main/docs/RAILWAY-DEPLOYMENT.md",
        kind: "docs",
      },
    ],
  },
};

const ENTERPRISE_AI_INVESTIGATION: EngineeringArtifact = {
  id: "enterprise-ai-investigation",
  accessionId: "RR-SYS-004",
  title: "Enterprise AI Investigation",
  type: "system",
  categoryLabel: "Agentic AI / Evidence Systems",
  collections: ["ai-genai", "ai-native-fullstack"],
  description:
    "Evidence-grounded agentic investigation system — a deterministic planner dispatches read-only SQL and document tools, every artifact is SHA-256 hashed, and synthesis is a citation-validated report that refuses to name a root cause without evidence.",
  technologies: ["FastAPI", "SQLAlchemy", "React 19", "Vite", "Pydantic", "Docker"],
  status: "VERIFIED",
  topologyNodes: ["input", "compute", "retrieve", "generate", "verify", "application"],
  dossier: {
    overview:
      "Enterprise AI Investigation is an agentic investigation and decision-support system: a business question enters as input, a deterministic planner turns it into a typed step plan, an orchestrator executes that plan through sandboxed tools (read-only SQL and document retrieval), every tool output becomes a typed evidence item with a SHA-256 content hash, and a synthesis layer produces an executive report in which every finding must cite valid evidence IDs. The repository presents itself as an educational portfolio project simulating an enterprise-grade investigation workflow, with a React investigation workspace over a FastAPI backend. Its design premise is that an LLM may draft the narrative, but the evidence store — not the model — decides what the report is allowed to claim.",
    problem:
      "When an operational anomaly hits — a churn spike, a billing surge — the investigation has to cross a relational database and internal documents, and the default tool, a raw LLM chat, fails in a specific way: it answers fluently without access to live data, invents plausible root causes, and cannot show which query or document a conclusion came from. Granting that same model unconstrained database or shell access trades hallucination risk for security risk. The repository's premise is that an enterprise investigation system must be auditable end to end: deterministic planning, sandboxed tools, immutable evidence with integrity hashes, and a synthesis layer that fails closed when the evidence does not support a conclusion.",
    system:
      "A two-tier application over SQLite: a FastAPI backend implementing the full investigation pipeline (deterministic planner, dependency-aware orchestrator, controlled tool registry, evidence store, append-only audit trail, synthesis with strict citation validation) and a React 19 + TypeScript + Vite investigation workspace that renders the plan timeline, an evidence inspector with per-item SHA-256 fingerprints, citation-chipped findings, a simulated human sign-off surface, and a filterable audit stream. LLM synthesis sits behind a one-method provider interface — the repository ships a deterministic offline MockLLMProvider, and any real provider drops in behind the same interface (verified in this audit with a GLM adapter, repository unmodified). The built frontend is served by the API in unified single-port mode, with multi-stage Docker and Compose packaging.",
    architecture: [
      "Deterministic planner — maps a business question to a typed, ordered step plan using explicit scenario definitions and keyword detection; no LLM is invoked at planning time, so the same question always produces the same plan (planner.py, ADR context).",
      "Orchestrator — executes the plan step by step through a controlled ToolRegistry only: it respects declared step order, blocks downstream steps when dependencies are unmet (STEP_BLOCKED audit events), isolates per-step errors, and records an audit event for every lifecycle transition.",
      "Controlled tools — sql_investigation accepts strictly read-only SELECT/WITH queries (forbidden-keyword token filter, comment stripping, multi-statement prevention, parameter and row caps) and document_retrieval performs list/get/search over a knowledge base with path-traversal and symlink rejection; no shell, filesystem, or dynamic code execution exists in the registry.",
      "Evidence store — every tool output becomes an immutable EvidenceItem with provenance (run, step, tool, source reference), typed content schemas, and a canonical SHA-256 content hash; failed or blocked steps record zero evidence, so nothing can be synthesized from a step that never succeeded.",
      "Audit trail — an append-only, per-run event log with monotonic sequence numbers covering investigation_started → plan_created → step/evidence transitions → synthesis_started/generated/validated, exposed in the UI as a filterable stream.",
      "Synthesis — a read-only consumer of the evidence store: PromptBuilder wraps all retrieved data inside labeled untrusted-data boundaries with prompt-injection defenses, the provider generates a structured JSON report, and the CitationValidator then verifies every cited evidence ID against the run's own store, rejecting foreign-run citations and setting root_cause to null when evidence is insufficient.",
      "Frontend workspace — React 19 + TypeScript + Vite: scenario presets and free-text question dispatch, step timeline with tool payloads, evidence inspector with integrity fingerprints and raw JSON views, findings with citation chips and confidence badges, a clearly labeled human-review simulation, and the audit stream; served by the FastAPI app as a static SPA in unified mode.",
    ],
    aiAgentWorkflow: [
      "Input — the analyst submits a business question (or a golden scenario preset); the planner deterministically produces an ordered, dependency-declaring step plan.",
      "Orchestrate — the orchestrator dispatches each step through the tool registry; SQL steps run read-only analytical queries, document steps search and retrieve the knowledge base.",
      "Collect — every successful tool output is normalized into typed EvidenceItems with full provenance and a SHA-256 content hash; failed steps contribute nothing.",
      "Audit — each transition (step started, evidence collected, step completed/blocked/failed) is appended to the per-run trail as it happens.",
      "Synthesize — the PromptBuilder serializes the evidence store into a boundary-labeled prompt; the configured LLMProvider returns a structured report draft grounded only in that block.",
      "Validate — the CitationValidator checks every finding and recommendation citation against the run's evidence store, marks citation_valid, and downgrades the report to VALIDATION_FAILED on any violation.",
      "Report — the workspace renders the executive summary, root-cause panel, cited findings, and recommendations behind a labeled human-review simulation; when evidence cannot support a conclusion, the report states the gap instead of a root cause.",
    ],
    technicalDecisions: [
      {
        id: "ADR-003",
        title: "Controlled tool registry — no arbitrary shell or code execution",
        rationale:
          "The orchestrator can only reach capabilities registered as typed tools; there is no shell, filesystem, or eval surface, so the agent's blast radius is exactly the read-only query and document interfaces.",
      },
      {
        id: "ADR-004",
        title: "Strictly enforced read-only SQL access",
        rationale:
          "Queries are token-filtered after comment stripping (SELECT/WITH only; INSERT/UPDATE/DELETE/DROP/PRAGMA etc. rejected), multi-statement payloads are refused, and row caps bound result size — verified live: a DELETE/DROP request was rejected with 'Prohibited statement type DELETE' and the database was untouched.",
      },
      {
        id: "ADR-005",
        title: "Provider-agnostic LLM layer",
        rationale:
          "Synthesis depends on a one-method LLMProvider interface with a deterministic offline mock as the shipped default, keeping the whole pipeline testable without keys; a real provider is an adapter, not a rewrite — proven during this audit by driving genuine GLM-4-plus synthesis through the shipped API with an external interface-compliant adapter, no repository changes.",
      },
      {
        id: "ADR-008",
        title: "Evidence integrity via SHA-256 content hashing",
        rationale:
          "Each EvidenceItem carries a canonical-JSON SHA-256 fingerprint, so any mutation of stored evidence is detectable; the UI surfaces the full fingerprint per item in the evidence inspector.",
      },
      {
        id: "ADR-009",
        title: "Evidence-constrained synthesis with strict citation validation",
        rationale:
          "The model drafts but never decides: the prompt treats evidence as untrusted data inside labeled boundaries, and the deterministic CitationValidator verifies every citation against the run's store — foreign-run or nonexistent citations invalidate the report.",
      },
    ],
    technicalDecisionsNote:
      "Decision summaries condensed from the repository's docs/DECISIONS.md (ADR-001 … ADR-011); the five above were re-verified against source and live behavior during this audit.",
    implementation: [
      "End-to-end pipeline endpoint (POST /investigations/investigate) returning the plan, step results, evidence items, audit events, and synthesized report in one response; scenario listing and latest-evaluation endpoints complete the API surface, with optional shared-key protection via timing-safe comparison.",
      "Deterministic seed producing the synthetic enterprise dataset (500 customers, subscriptions, billing events, support tickets, product incidents, release events) with planted causal signals for the churn scenario.",
      "Golden evaluation harness (run_evaluation.py) executing six scenarios — churn, support spike, product incident, insufficient evidence, SQL-mutation rejection, path-traversal rejection — and writing timestamped reports to evaluation_reports/.",
      "Investigation workspace (React 19 + TypeScript + Vite, 32 component tests) with unified single-port serving from the FastAPI app when frontend/dist is built.",
      "Multi-stage Docker image, docker-compose with health checks, and a CI pipeline running the backend suite on Python 3.12 and 3.14, the frontend suite, and the golden evaluation on every push and pull request.",
    ],
    verification: [
      "Backend suite executed locally during this audit (Python 3.12.14, pytest 9.1.1): 207 passed, 0 failed, 0 skipped in 15.45s — covering security guards, citation validation, planner, tools, evidence, orchestration, and API security.",
      "Frontend suite executed locally: 32/32 tests passing across 8 suites (vitest); production build compiled.",
      "Golden evaluation executed locally: 6/6 scenarios passing, reports regenerated into evaluation_reports/; the committed latest_evaluation.md (2026-08-15) records the same 6/6 with per-scenario run IDs and mean evidence recall / root-cause precision of 1.00 on the system's own golden dataset.",
      "Live hands-on verification on 30 Aug 2026 against the locally running application with a real LLM provider (GLM-4-plus behind the repository's LLMProvider interface): the full churn investigation completed in ~18s — 9 planned steps, 9 hashed evidence items, a 7-finding report with per-finding citations, citation_valid true, and the audit trail closing with SYNTHESIS_VALIDATED (valid citations: 9).",
      "Zero-fabrication refusal verified live with the same real provider: an off-domain question (unicorn fleet routing on Mars) returned a report with root_cause null, a single evidence-cited finding stating no records exist, and limitations describing the gap — no invented root cause.",
      "Security boundaries verified live: a DELETE/DROP question was blocked at the tool boundary ('Prohibited statement type DELETE. Only read-only SELECT or WITH queries are permitted.') with the customers table intact (500 rows) and zero evidence recorded from the failed step; '../../etc/passwd' and '..\\windows\\system32' document identifiers were both rejected as path traversal while the legitimate postmortem document retrieved normally.",
    ],
    verificationNote:
      "Verified hands-on on 30 Aug 2026: backend, frontend, and golden-evaluation suites were executed locally for this audit (counts above are executed results, not README claims), and the end-to-end runs used the shipped HTTP API and workspace UI. The repository's shipped provider is the deterministic offline mock; the real-model runs cited here drove a GLM-4-plus adapter behind the repository's own LLMProvider interface via an external launcher — the repository itself is unmodified. Golden-evaluation figures are the system's deterministic self-benchmark on its own seeded dataset, not an independent benchmark.",
    figures: [
      {
        src: "/artifacts/enterprise-ai-investigation/workspace.webp",
        alt: "Investigation workspace after a real GLM-4-plus run — status cards, CITATIONS 100% VERIFIED badge, executive summary and root cause panel",
        caption:
          "FIG. 01 — The workspace after a live end-to-end investigation with a real LLM provider (GLM-4-plus): 9/9 steps completed, 9 hashed artifacts, 33 lifecycle events, and the synthesized report passing strict citation validation.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/enterprise-ai-investigation/timeline.webp",
        alt: "Investigation plan and tool execution timeline showing STEP-01 with rationale, the read-only SQL payload, and the collected evidence artifact",
        caption:
          "FIG. 02 — The deterministic plan as executed: each step exposes its rationale, the exact read-only SQL dispatched through the tool registry, its row count, and the evidence artifact it produced.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/enterprise-ai-investigation/evidence-inspector.webp",
        alt: "Evidence inspector drawer for EVID-001 with SHA-256 content integrity fingerprint, provenance, executed query and raw result rows",
        caption:
          "FIG. 03 — The evidence inspector: EVID-001's provenance (run, step, tool, collection order), its SHA-256 content integrity fingerprint, the executed analytical query, and the raw monthly cancellation rows it produced.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/enterprise-ai-investigation/findings-citations.webp",
        alt: "Findings FND-005 to FND-007 with evidence citation chips, contributing factors, limitations, and a recommendation awaiting simulated human sign-off",
        caption:
          "FIG. 04 — The grounded report's tail: every finding carries evidence-citation chips and a confidence badge; recommendations sit behind the explicitly labeled human-review simulation with pending sign-off.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/enterprise-ai-investigation/audit-trail.webp",
        alt: "Immutable audit trail stream showing step, evidence and synthesis lifecycle events through SYNTHESIS_VALIDATED",
        caption:
          "FIG. 05 — The append-only audit trail: sequential, per-run lifecycle events from step execution through evidence collection to SYNTHESIS_VALIDATED, rendered as a filterable stream.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/enterprise-ai-investigation/insufficient-evidence.webp",
        alt: "Zero-fabrication refusal with a real LLM — root cause panel stating no root cause could be established and zero speculations were manufactured",
        caption:
          "FIG. 06 — The refusal path with a real model: asked about an off-domain incident, the system reports root_cause null, cites the one empty query as evidence, and states the gap in limitations instead of inventing a cause.",
        width: 1440,
        height: 900,
      },
    ],
    limitations: [
      "The repository's shipped synthesis provider is a deterministic offline MockLLMProvider; real-model behavior exists only behind the pluggable LLMProvider interface (configured externally in this audit, not in the repository).",
      "The investigated business scenario is synthetic by design — seeded deterministic data with planted causal signals; no real company, customer, or production data is involved.",
      "Audit trail and evidence store are in-memory per investigation run (by the repository's own description) — state does not persist across processes or restarts.",
      "Planning is deterministic keyword/scenario detection, not model-driven planning — the agentic intelligence concentrates in orchestration, evidence handling, and grounded synthesis.",
      "The human review surface is a clearly labeled simulation; approving a recommendation executes no external action.",
      "API protection is an optional shared X-API-Key; there is no user/account system, and deployments beyond the local Docker/Compose setup are documented but not published.",
      "The frontend has no live public deployment; all verification in this audit was local (backend + built SPA on one port).",
    ],
    links: [
      {
        label: "github.com/rishav579/enterprise-ai-investigation",
        href: "https://github.com/rishav579/enterprise-ai-investigation",
        kind: "repository",
      },
      {
        label: "docs/ARCHITECTURE.md",
        href: "https://github.com/rishav579/enterprise-ai-investigation/blob/main/docs/ARCHITECTURE.md",
        kind: "docs",
      },
      {
        label: "docs/DECISIONS.md",
        href: "https://github.com/rishav579/enterprise-ai-investigation/blob/main/docs/DECISIONS.md",
        kind: "docs",
      },
    ],
  },
};

const DEMAND_RISK_ENGINE: EngineeringArtifact = {
  id: "demand-risk-engine",
  accessionId: "RR-SYS-003",
  title: "Demand-Risk Intelligence Engine",
  type: "system",
  categoryLabel: "Demand Forecasting / Decision Intelligence",
  collections: ["data-ml-systems"],
  description:
    "Forecast-aware supply-chain decision engine — a 40-check quality gate feeds relational marts, a LightGBM multi-horizon forecaster benchmarked against statistical baselines, a daily runout simulation with tiered safety-stock logic, and a prescriptive replenishment planner served over FastAPI and a Streamlit decision dashboard.",
  technologies: ["Python", "LightGBM", "pandas", "SQLAlchemy", "FastAPI", "Streamlit"],
  status: "VERIFIED",
  topologyNodes: ["ingest", "compute", "verify", "application"],
  dossier: {
    overview:
      "The Demand-Risk Intelligence Engine is an operational decision-support system for a multi-facility retail network: it turns transaction-level sales and inventory telemetry into ranked, explained replenishment actions. A seeded synthetic data engine produces a full year of enterprise telemetry; a 40-check quality gate controls what enters relational storage; SQL marts segment products and score suppliers; a LightGBM model forecasts demand 7/14/30 days ahead against statistical baselines; a daily balance simulation converts forecasts into exact runout dates; tiered safety-stock and reorder-point math converts runouts into risk scores with root-cause attribution; and a prescriptive layer emits purchase orders, DC-to-store transfers, and excess-hold actions with written rationale. The repository is explicit that it is a synthetic enterprise work-sample: the ground truth is planted, which is what makes the engine's outputs objectively checkable.",
    problem:
      "A retail network running on static min-max reorder rules fails in predictable ways: promotions and regional seasonality spike demand past naive thresholds, critical SKUs stock out during high-velocity windows while slow movers accumulate working capital, and supplier lead-time variance silently invalidates whatever buffer someone hardcoded. The system has to answer four questions in order — what demand is coming, where risk is brewing, what is causing it, and what a planner should do today — and each answer has to be checkable against the numbers rather than asserted. The repository's answer to checkability is to generate the enterprise itself, with planted causal signals, so every forecast and risk call has a known ground truth.",
    system:
      "A single-process Python system over SQLite, composed in four layers: a deterministic data engine and gated ingestion boundary (src/data), a SQL marts layer (src/analytics), a forecasting-and-risk core (src/forecasting, src/risk), and a serving layer (src/api, src/ui). The serving core is an IntelligenceService singleton that trains the champion LightGBM forecaster on initialization with strict chronological splits, then caches forecasts, simulated risk positions, and recommendations for both the FastAPI REST service and the five-tab Streamlit decision dashboard. The whole pipeline is reproducible from a fixed seed: rerunning produces the same records, forecasts, and action plan.",
    architecture: [
      "Deterministic data engine — an instance-RNG generator (random.Random(42), ADR-005) produces 365 days of telemetry for 5 facilities × 15 SKUs (21,900 sales transactions, 27,375 inventory snapshots, 2,388 supplier deliveries) with planted causal signals: a +35% promotional lift, a +9-day supplier delay, a coupled stockout crisis, regional seasonality, and a slow-moving excess-capital SKU.",
      "Quality gate and storage — 40 deterministic checks (table sanity, primary/composite uniqueness, referential integrity, value ranges, date ordering, fulfillment arithmetic) run before any INSERT; a CRITICAL failure raises DataQualityError and blocks ingestion entirely (ADR-006). Clean datasets land in SQLite through SQLAlchemy 2.0 DDL with enforced foreign keys.",
      "Analytical marts — SQL-first aggregations: daily product velocity, ABC/XYZ 9-cell segmentation (80/15/5 revenue Pareto × demand-variance classes), supplier scorecards with OTIF and lead-time variance, and an inventory-health mart with Days-of-Supply and a 5-tier operational taxonomy (ADR-007).",
      "Forecasting core — strict chronological splits (train Jan–Sep, validation Oct–mid Nov, test holdout mid Nov–Dec; random splitting prohibited), 16 leakage-free features (lags 1/7/14/28, shift(1) rolling means/std, calendar, promotion, price, lead time), and a LightGBM regressor with early stopping on validation, benchmarked across 7/14/30-day horizons against Naive, 7-day Seasonal Naive, and exponential smoothing (ADR-008).",
      "Risk engine — a forecast-aware daily balance simulation per SKU × location node (30-day forecast stream, trailing-7-day continuation out to 180 days, scheduled in-transit PO arrivals, fractional-day runout precision); tiered safety stock SS = Z·√(LT·σD² + D̄²·σLT²) with ABC-tiered service levels (A: 98% Z=2.05, B: 95%, C: 90%); reorder point and order-up-to targets; 0–100 stockout risk scoring; a deterministic 6-category root-cause attribution; and a prescriptive generator producing DC_TRANSFER (2-day transit), PURCHASE_ORDER, and HOLD_ORDER actions with computed quantities and written rationale (ADR-009).",
      "Serving layer — a thread-safe IntelligenceService singleton (double-checked locking) that trains the champion model once and caches forecasts, risk nodes, and recommendations; FastAPI exposes /health, /summary, /forecast, /risk, /inventory, and /recommendations with typed Pydantic schemas, optional API-key auth (timing-safe comparison), environment-configured CORS, and 404s on unknown location/product ids; Streamlit renders the five-tab planner dashboard from the same cached service (ADR-010).",
    ],
    technicalDecisions: [
      {
        id: "ADR-002",
        title: "Deterministic synthetic telemetry with planted causal signals",
        rationale:
          "Public retail datasets lack paired supplier-delivery telemetry, lead-time variance, and controlled interventions. Generating the enterprise locally with seed 42 means every causal signal (promo lift, supplier delay, stockout crisis) has known ground truth — the forecasting and risk engines can be evaluated objectively instead of anecdotally.",
      },
      {
        id: "ADR-006",
        title: "Pre-ingestion quality gating with strict failure policy",
        rationale:
          "Corrupt records poison downstream models silently. All 40 checks run before any INSERT; a single CRITICAL failure blocks loading completely, so corruption is caught and attributed at the boundary rather than inside a forecast.",
      },
      {
        id: "ADR-008",
        title: "Strict chronological splitting and mandatory baseline benchmarking",
        rationale:
          "Random splits leak the future into training and overstate accuracy. Splits are date-enforced, all rolling features are shifted at least one day, and the gradient-boosted model is only the champion if it beats Naive, Seasonal Naive, and exponential smoothing across multi-horizon WAPE/RMSE on the unseen holdout.",
      },
      {
        id: "ADR-009",
        title: "Forecast-aware simulation with tiered statistical safety stock",
        rationale:
          "Point forecasts alone don't tell a planner when to act. The daily balance simulation converts forecasts into exact runout dates (including in-transit POs and fractional-day precision), and safety stock is computed per ABC revenue class — Class A SKUs carry a 98% service level, Class C a 90% — so buffer capital concentrates where revenue concentration is.",
      },
      {
        id: "ADR-003",
        title: "Lean, in-process technology stack",
        rationale:
          "No Kafka, Spark, Airflow, or Kubernetes: SQLite, pandas, LightGBM, FastAPI, and Streamlit. For a 75-node network the entire pipeline retrains in seconds on a laptop, which keeps the system reviewable and reproducible; the trade-off is single-node scale, stated plainly rather than papered over.",
      },
    ],
    technicalDecisionsNote:
      "Decision summaries condensed from the repository's docs/DECISIONS.md (ADR-001 … ADR-010); the five above were re-verified against source and live execution during this audit.",
    implementation: [
      "End-to-end pipeline as shippable code: python -m src.data.ingestion generates, validates, and seeds the database; IntelligenceService.initialize() builds marts, trains the champion forecaster, simulates all 75 nodes, and compiles the action plan — the FastAPI app and Streamlit dashboard are two faces of the same cached state.",
      "REST surface with typed Pydantic response schemas, per-endpoint filters (facility, SKU, horizon, risk tier, action type, priority), a /health probe with liveness/readiness for container orchestration, and production-hardening defaults (API key auth via timing-safe comparison, environment-declared CORS).",
      "Five-tab Streamlit decision dashboard: executive KPI overview with CSV export of urgent actions, forecast explorer with per-node WAPE/bias recomputed from the model's own predictions, a 75-node risk grid with tier/cause/search filters, a recommendation center rendering each action with its full mathematical context, and a per-node drill-down with root-cause diagnosis.",
      "Test suite of 119 tests (95 unit, 24 integration) covering the generator, all 40 quality checks with corrupted fixtures, segmentation math, splits, features, baselines, model, evaluation, safety stock, simulation, scoring, attribution, recommendations, API auth/schemas/service/endpoints, and a Streamlit smoke test — run in CI on Python 3.10 on every push.",
      "Configuration via pydantic-settings (.env: database URL, seed, service levels, horizon defaults); README documents the four-command quick start (ingest, pytest, uvicorn, streamlit).",
    ],
    verification: [
      "Full test suite executed locally (Python 3.12.14, pip install -e .[dev]): 119 passed, 0 failed, 0 skipped in ~36s — 95 unit + 24 integration. The README's quick start claims 117 tests; the executed suite is larger, so the repository claim is stale, and this record publishes only the executed count.",
      "Ingestion executed live: the quality gate ran all 40 checks — 40/40 PASS, 100% pass rate, 0 warnings — and seeded SQLite with the exact published scale (21,900 / 27,375 / 2,388 fact rows; 15 products, 5 locations, 4 suppliers).",
      "Forecasting benchmark executed end-to-end on the seeded database: strict chronological splits verified with an explicit assertion (max train date < min validation date < min test date; 16,380 / 2,760 / 2,760 rows). LightGBM holdout WAPE 0.1097 vs ExponentialSmoothing 0.2130, Naive 0.2152, SeasonalNaive 0.3542 across 3,060 test points; per-horizon WAPE 0.1061 (7d), 0.1077 (14d), 0.1115 (30d); bias +0.0042. Every headline number in the repository's README/summary reproduced exactly on a different machine — strong evidence the pipeline is genuinely deterministic (seed 42).",
      "Risk pipeline executed on all 75 nodes: tiers 26 CRITICAL / 8 HIGH / 8 MEDIUM / 33 LOW; capital at risk $5,149.75; annual holding drag $1,029.95; root causes attributed across all nodes; 48 recommendations = 12 DC transfers + 29 purchase orders + 7 excess holds, 24 urgent — identical to the repository's published summary.",
      "Safety-stock math spot-checked against source: the first CRITICAL node (AX segment, Class A Z=2.05) computes SS 75.97 and ROP 176.98 from lead-time and demand variance; with 81 units on hand and zero inbound POs, the simulator reports runout at 5.9 days and attribution returns UNDER_REPLENISHED with the position/ROP breach spelled out in the rationale text.",
      "Live API verified against the executed pipeline: /health returns healthy with database connectivity and liveness/readiness flags; /summary matches the executed tier and action counts; /forecast returns daily y_true/y_pred pairs; /risk?risk_tier=CRITICAL returns 26 positions; /recommendations?action_type=DC_TRANSFER returns 12; an unknown product id 404s as designed.",
      "Streamlit dashboard ran locally and all five tabs were exercised in a browser at 1440×900 — the executive KPI cards, forecast explorer (live-computed node WAPE 9.49% / bias +2.41% for the selected node), the 75-node risk grid, the prescriptive action cards with rationale text, and the CRITICAL-node drill-down (0 units, 0.0 days to runout, INSUFFICIENT_SAFETY_BUFFER diagnosis). All figures below are those live captures.",
    ],
    verificationNote:
      "Verified hands-on on 30 Aug 2026: the pytest suite, the 40-check ingestion gate, the full forecasting benchmark, and the complete risk/recommendation pipeline were all executed locally (Python 3.12.14 venv), and both serving layers (FastAPI, Streamlit) ran live — figures are browser captures of the running dashboard. Executed results matched the repository's published summary exactly, with two honest divergences recorded: the test suite is 119 tests, not the README's claimed 117, and the /summary endpoint's champion WAPE (0.1097) is a hardcoded constant in service.py — independently re-confirmed as correct by executing the full benchmark, but it is not computed from the live model at request time. All numbers describe the system's own seeded synthetic telemetry; none are real business results.",
    figures: [
      {
        src: "/artifacts/demand-risk-engine/executive-overview.webp",
        alt: "Executive overview tab — 75 node positions, 26 critical stockout risks, $5,149.75 capital at risk, 48 open actions, and risk/action breakdown charts",
        caption:
          "FIG. 01 — Executive overview, live: 75 active node positions, 26 critical stockout risks, $5,149.75 excess capital at risk, and 48 open prescriptive actions (24 urgent) — every KPI matching the locally executed pipeline.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/demand-risk-engine/forecast-explorer.webp",
        alt: "Forecast explorer — LightGBM forecast line against true demand for Cold Brew Coffee at LOC-ST-01 with live WAPE and bias metrics",
        caption:
          "FIG. 02 — Forecast explorer: champion LightGBM daily predictions vs true unconstrained demand for a 30-day holdout window at one node; the dashboard recomputes node-level accuracy live — 845 actual vs 865 forecast units, 9.49% WAPE, +2.41% bias.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/demand-risk-engine/risk-explorer.webp",
        alt: "Risk explorer — 75-node grid with tier and root-cause filters, CRITICAL rows at score 100 with zero available stock",
        caption:
          "FIG. 03 — The risk grid over all 75 SKU × location nodes, filterable by tier and root cause: the top CRITICAL rows are hard stockouts (score 100, zero available stock) queued behind in-transit POs.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/demand-risk-engine/recommendation-cards.webp",
        alt: "Recommendation center — URGENT DC_TRANSFER cards with recommended quantity, days to runout, reorder point, and written rationale",
        caption:
          "FIG. 04 — The prescriptive center: each action card carries its computed quantity, runout timing, reorder point, root cause, and a written rationale — 48 of 48 actions shown with CSV export.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/demand-risk-engine/urgent-actions.webp",
        alt: "Top urgent action items table — ten ranked recommendations with action type, quantity, days to runout, and root cause columns",
        caption:
          "FIG. 05 — The urgent-action queue behind the executive view: DC transfers and purchase orders ranked ahead of supplier lead time, with per-action root causes and one-click CSV export for the planner.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/demand-risk-engine/sku-drilldown.webp",
        alt: "SKU drill-down — Sunscreen Lotion at Midtown Manhattan: 0 units stock, 0.0 days to runout, 98.8 safety stock, 220.6 reorder point, INSUFFICIENT_SAFETY_BUFFER diagnosis",
        caption:
          "FIG. 06 — Per-node drill-down of a hard stockout: Sunscreen SPF 50 at Midtown Manhattan at zero stock with runout now, 98.8-unit safety stock, 220.6-unit reorder point, and the INSUFFICIENT_SAFETY_BUFFER diagnosis in plain language.",
        width: 1440,
        height: 900,
      },
    ],
    limitations: [
      "Synthetic enterprise work-sample by design: the network, telemetry, promotions, and supplier behavior are seeded fabrications (seed 42). Every figure on this page is the system's own generated data — no real customer, company, or business outcome is involved, and none is claimed.",
      "The champion's global WAPE (0.1097, executed) hides segment-level degradation: on the sparse slow-moving C–Z segment the executed WAPE is 2.40 across 408 test points — relative error explodes on near-zero demand series even though absolute error stays at half a unit. The repository does not surface this in its summary.",
      "The /summary endpoint hardcodes champion_model_wape = 0.1097 (service.py) rather than computing it from the fitted model; the value is correct against the executed benchmark but is a constant, and the README's example response presents it as if measured per request.",
      "The Streamlit SKU Drill-Down is described in the README as a step-by-step daily trajectory view; the implementation renders node metrics and a root-cause diagnosis only. The daily trajectory exists in the simulation layer (and its tests), but is not visualized in the UI.",
      "Serving is single-process and in-memory: the model retrains at every service start, no model artifact is persisted, there is no rolling-origin backtesting beyond the single 46-day chronological holdout, and the audit/evaluation story is per-run.",
      "Root-cause attribution is a deterministic rule hierarchy (six categories), not a learned model — useful and explainable, but bounded by the rules' authors.",
      "Local-only verification: no public deployment exists; CI executes the suite on Python 3.10 while this audit ran 3.12 (no behavioral differences observed).",
    ],
    links: [
      {
        label: "github.com/rishav579/Real-Time-Demand-Risk-Intelligence-Engine",
        href: "https://github.com/rishav579/Real-Time-Demand-Risk-Intelligence-Engine",
        kind: "repository",
      },
      {
        label: "docs/ARCHITECTURE.md",
        href: "https://github.com/rishav579/Real-Time-Demand-Risk-Intelligence-Engine/blob/main/docs/ARCHITECTURE.md",
        kind: "docs",
      },
      {
        label: "docs/DECISIONS.md",
        href: "https://github.com/rishav579/Real-Time-Demand-Risk-Intelligence-Engine/blob/main/docs/DECISIONS.md",
        kind: "docs",
      },
    ],
  },
};

const MERIDIAN_MARKET: EngineeringArtifact = {
  id: "meridian-market",
  accessionId: "RR-SYS-005",
  title: "Meridian Market",
  type: "system",
  categoryLabel: "AI-Native Commerce / Transactional Full-Stack",
  collections: ["ai-genai", "ai-native-fullstack"],
  description:
    "Multi-vendor marketplace with a transactional core — atomic inventory reservation, integer-cents commission splits, an order state machine whose PAID transition is owned by an HMAC-verified payment webhook, a socket.io realtime layer, and a catalog-grounded AI assistant with a deterministic fallback.",
  technologies: ["Next.js 16", "TypeScript", "React 19", "Prisma", "SQLite", "Socket.IO", "Tailwind CSS 4", "Zustand", "TanStack Query", "Vitest"],
  status: "VERIFIED",
  topologyNodes: ["input", "compute", "generate", "verify", "application"],
  dossier: {
    overview:
      "Meridian Market is a multi-vendor marketplace prototype built production-shaped: four storefronts sell from one catalog, and every purchase crosses the hard problems that make marketplaces hard — inventory reserved atomically across independent stores, money handled as integer cents with a per-line commission split that always reconciles, duplicate checkouts deduplicated by database-backed idempotency keys, and a payment state machine where PAID is a verified financial event rather than an administrative opinion. A separate socket.io service pushes order events to vendor and admin dashboards over HMAC-authorized rooms, and an AI shopping assistant answers budget-aware product questions from the live catalog, degrading to a deterministic recommender when the LLM is unavailable. The payment gateway is a simulated Stripe Connect that reproduces the real wire contract — PaymentIntent lifecycle, per-store transfers, `t=<ts>,v1=<sig>` HMAC-SHA256 webhook signatures with a replay window — and delivers its signed webhook to the application's own endpoint over HTTP, so the settlement path is exercised exactly as production would run it.",
    problem:
      "Multi-vendor checkout concentrates a dense cluster of failure modes in one request: two customers can race for the last unit of stock (time-of-check to time-of-use), network retries can double-charge and double-decrement, floating-point money drifts off by cents until ledgers stop reconciling, and if any human role can mark an order PAID, the financial state stops meaning anything. Around the transaction, the platform also needs sub-second vendor notifications without polling, and product discovery that answers real shopper language (\"audio under $200\") without inventing products the catalog doesn't carry. Each of these has a known production answer — conditional decrements inside a transaction, idempotency keys, integer cents, webhook-only money transitions, a realtime fan-out service, retrieval-grounded generation with honest failure — and the repository's premise is that a portfolio build should implement those answers rather than simulate around them.",
    whyBuilt:
      "The repository's own framing: it exists to explore the architectural and transactional challenges inherent to multi-vendor commerce platforms — safe inventory reservation across independent stores, database-backed idempotency against network retries, a financial state machine where PAID represents a verified event rather than an opinion, webhook verification that matches production payment-gateway contracts, and a grounded AI assistant that degrades gracefully instead of failing silently when the LLM is unreachable.",
    system:
      "A two-process TypeScript system over SQLite (Prisma, PostgreSQL-ready schema): the Next.js 16 App Router application owns the REST API (~25 route handlers composed through one `withApi` middleware: rate limit → CSRF → session → RBAC → handler → typed error envelope), the Prisma data layer, and the single-route storefront (Zustand + TanStack Query over hash-based views); the standalone socket.io mini-service owns realtime fan-out — browsers authenticate with 60-second HMAC tickets minted by the API, and the backend broadcasts through a secret-guarded control plane on a separate port. The simulated Stripe Connect boundary, the order state machine, the integer-cents split math, and the RAG-lite AI assistant all live in small audited modules under src/lib. Seven Vitest suites drive the real route handlers through the real middleware pipeline against a throwaway SQLite database built from the real schema.",
    architecture: [
      "API middleware — every mutating request passes `withApi` (src/lib/api.ts): sliding-window per-IP rate limiting with Retry-After headers, layered CSRF (double-submit cookie with timing-safe comparison, Fetch Metadata cross-site rejection, origin-vs-host fallback), opaque session resolution, and role checks, with a single typed error envelope (Zod → 422, ApiError → status, else 500).",
      "Transactional checkout — POST /api/checkout runs one interactive Prisma transaction: conditional stock decrement (`UPDATE … WHERE stock >= qty` with a count check aborting on mismatch), Order + snapshotted OrderItems + per-store Payout rows + cart clearance; the signed `payment_intent.succeeded` webhook is then delivered to the application's own /api/webhooks/stripe endpoint over HTTP, and settlement flips the order to PAID and payouts to AVAILABLE through the verified-webhook path.",
      "Order state machine — ORDER_TRANSITIONS defines legal edges and TRANSITION_AUTHORS defines which roles may author each target status; PAID's author list is empty, and the PATCH handler additionally refuses any PAID request with 403. Every transition appends an immutable OrderEvent and broadcasts order:status to the order's rooms; cancellation restocks inventory and reverses pending payouts inside the same transaction.",
      "Payment boundary — src/lib/payments.ts reproduces the Stripe Connect destination-charge contract natively: `pi_`/`tr_`/`evt_` identifiers, requires_capture → succeeded lifecycle, per-store transfers after the platform's commission, and webhook signing (`t=<ts>,v1=<HMAC-SHA256>` over `<ts>.<payload>`) verified timing-safely on the raw body before JSON parsing with a strict 5-minute replay window; replayed events are settlement no-ops by design.",
      "Realtime service — mini-services/realtime runs socket.io on :3003 (path /, behind the platform gateway) with room membership never client-declared: the API mints 60-second HMAC-SHA256 tickets ({sub, role, storeId, exp}), the service verifies them and joins user:/store:/admin rooms server-side; backend broadcasts arrive on a separate control-plane HTTP server on 127.0.0.1:3004 guarded by a shared secret and a 1 MB body cap.",
      "AI assistant — src/lib/ai.ts is RAG-lite at catalog scale: regex budget extraction, stop-word-filtered tokenization, weighted substring scoring (name ×5, tags ×3, category ×3, description ×1, rating/featured boosts) over ACTIVE stores with stock, top-6 products injected into a strict recommend-only-from-catalog system prompt; one z-ai LLM call with session history, and any LLM failure falls back to a deterministic catalog-backed recommender with degraded: true exposed to the UI.",
      "Data model — 12 Prisma models with integer-cents money columns, indexed hot-path foreign keys, unique idempotency keys, and OrderItem rows that snapshot product/store names, prices, and the commission split at purchase time so vendor reports stay historically accurate; constrained String unions in src/lib/constants.ts enforced at every boundary by Zod schemas (the documented SQLite → PostgreSQL flip is a provider change plus enum conversion).",
    ],
    aiAgentWorkflow: [
      "The assistant is deliberately not agentic — it is a single grounded generation step, and the record describes it exactly as implemented:",
      "Retrieve — the shopper's message is parsed for budget constraints (\"under $150\") and stop-word-filtered tokens; every product from ACTIVE stores with stock (take 200) is scored by weighted substring match and the top 6 are returned as typed RetrievedProduct records.",
      "Ground — the retrieved catalog is serialized into a strict system prompt (\"recommend ONLY products from the catalog below. Never invent products or prices. If nothing fits, say so honestly\") alongside the last 8 session messages.",
      "Generate — one LLM call through z-ai-web-dev-sdk produces the reply; the reply plus the product cards are persisted to the ChatSession for continuity.",
      "Degrade — any LLM failure (missing credentials, network, empty completion) falls back to a deterministic catalog-backed recommendation and flags degraded: true, so the feature fails honest instead of erroring; the forced-offline path is covered by the integration suite and was observed live during test execution.",
    ],
    technicalDecisions: [
      {
        id: "ADR-07",
        title: "Integer cents everywhere with a single rounding point",
        rationale:
          "Every monetary value is an integer number of cents from Zod input to Prisma storage; exactly one place rounds — computeLineSplit's half-up commission — and its invariant (commission + vendorEarnings = lineTotal) is unit-tested and held on every live order checked in this audit (19999 → 2000 + 17999; 39998 → 4000 + 35998).",
      },
      {
        id: "ADR-10",
        title: "Order state machine with transition authorship; PAID settable only by the webhook",
        rationale:
          "Encoding the machine as data (two tables) makes it table-driven-testable and gives the webhook an unambiguous monopoly on money-state transitions — the PATCH handler refuses PAID outright, verified live with an admin session (403). The ADR itself discloses the residual trade-off: authorship is convention backed by an explicit handler guard, and a documented server-side fallback settles orders directly if internal webhook delivery fails.",
      },
      {
        id: "ADR-04",
        title: "Simulated Stripe Connect mirroring the exact wire contract, instead of a mocking library",
        rationale:
          "Because the simulator reproduces the wire format (identifiers, intent lifecycle, HMAC signature scheme), the application's raw-body signature check, replay window, idempotent settlement, and self-delivery loop are all exercised for real; swapping to the production SDK is confined to three function bodies while the webhook verifier stays byte-for-byte identical.",
      },
      {
        id: "ADR-05",
        title: "socket.io mini-service with HMAC room tickets; control plane split from the socket port",
        rationale:
          "Room membership is never client-declared — browsers redeem 60-second HMAC tickets and rooms are assigned server-side, so a socket client can only ever receive its own events; broadcasts travel over a separate secret-guarded control plane bound to loopback, and realtime is fire-and-forget with a re-fetch backstop rather than a delivery guarantee.",
      },
      {
        id: "ADR-06",
        title: "RAG-lite scored retrieval over embeddings at 12–200 SKU scale",
        rationale:
          "A ~30-line deterministic scorer (budget extraction + weighted substring fields) needs no embedding pipeline or vector index at this catalog size, keeps recall auditable, and degrades to an honest zero-match answer; the documented upgrade path (pgvector cosine top-k) preserves the same prompt contract when catalog scale demands it.",
      },
      {
        id: "ADR-08",
        title: "In-memory TTL cache and rate limiter behind narrow interfaces as Redis swap points",
        rationale:
          "Both subsystems run in process memory accessed only through their exported function signatures, so the single-node sandbox avoids a daemon while the multi-instance swap (GET/SETEX, INCR+EXPIRE) is a re-implementation, not a refactor — the per-instance state limitation is stated plainly rather than hidden.",
      },
    ],
    technicalDecisionsNote:
      "Decision summaries condensed from the repository's DECISIONS.md (twelve ADRs, each with context, decision, trade-offs, and the rejected alternative); the six above were re-verified against source and live behavior during this audit.",
    implementation: [
      "~25 REST route handlers under src/app/api (auth, catalog, cart, checkout, orders, payouts, stores, admin stats, AI chat, realtime tickets, Stripe webhook) all composed through the withApi pipeline with per-route rate-limit budgets (login 10/min, checkout 8/min, AI chat 15/min, catalog reads 120/min).",
      "Standalone realtime mini-service (mini-services/realtime, Bun + socket.io): room-authorized event fan-out with ticket authentication, a loopback-only control plane for backend broadcasts, graceful SIGTERM/SIGINT shutdown, and its own Dockerfile.",
      "Guest-to-user cart continuity: guest carts keyed by an httpOnly 30-day token cookie, merged server-side on login (quantities summed, capped to stock and 20, prices refreshed from the live product row) inside one transaction.",
      "Test architecture: vitest with a global setup that provisions a throwaway SQLite database from the real Prisma schema per run; helpers invoke real Next.js route handlers through the real middleware pipeline with closed loopback ports so the webhook fallback and realtime degradation paths execute deterministically.",
      "CI (GitHub Actions) runs lint → typecheck → tests → standalone build with deterministic dummy secrets; Dockerfile and docker-compose packaging for the app plus the realtime service, and a seed script provisioning 6 accounts (admin, 4 vendors incl. one PENDING store, customer), 4 stores, and 12 catalog products.",
    ],
    verification: [
      "Full test suite executed locally (Vitest, isolated per-run SQLite via the real schema): 75/75 tests passing across all 7 suites in 7.91s — the executed result matches the README's 75/75 claim exactly (unit: money 8, order-machine 9, payments 11; integration: checkout 12, auth-rbac 15, webhook 11, ai-assistant 9).",
      "Guest checkout executed end-to-end against the running app: 201 with the order settling PAID via the self-delivered signed webhook (webhookDelivered: true), events PENDING → PAID, and the split invariant visible in the confirmation UI — $399.98 total → $40.00 fee + $359.98 to the vendor; stock decremented exactly once (33 → 32).",
      "Idempotency verified live: replaying the same Idempotency-Key returned the identical order (same id and order number) with no second decrement, and a second customer reusing the key was refused 403.",
      "Race safety verified under real concurrency: stock set to 1 and two checkouts fired in parallel from independent guest sessions — exactly one 201 order and one 409 INSUFFICIENT_STOCK rollback; the conditional-decrement + count-check left no negative stock and no orphan order.",
      "Webhook boundary attacked directly: unsigned → 400; tampered payload with a valid-signature header → 400 Signature mismatch; correctly signed with a 6-minute-old timestamp → 400 (replay window); valid signed event on a PENDING order → 200 with the order PAID and payouts AVAILABLE; replaying the identical event was a settlement no-op (no duplicate transition or event).",
      "State machine authorship verified live: admin PATCH PENDING → PAID refused 403 (\"PAID status can only be set by the payment webhook\"), illegal edges (PAID → SHIPPED, PAID → PAID) refused 409, PAID → PROCESSING succeeded with an OrderEvent appended, and vendor cancellation restocked inventory and flipped the payout to REVERSED in one transaction.",
      "CSRF and rate limiting verified live: a cross-site Fetch-Metadata POST → 403, a forged double-submit token → 403, a matching pair → 200, and eleven rapid login attempts produced exactly ten 401s then a 429 (10/min budget) — the session cookie is httpOnly, SameSite=Lax.",
      "AI assistant exercised live with the real LLM (degraded: false): \"wireless headphones under $250\" returned only catalog products at catalog prices with a grounded recommendation, and an off-catalog query (\"quantum flux capacitors\") drew an honest no-match answer suggesting the closest alternatives — no invented products; the deterministic offline fallback (degraded: true) was additionally exercised by the integration suite's forced-offline provider.",
      "Realtime verified in a real browser through the platform gateway: the vendor dashboard showed the socket \"Live updates on\" indicator, a guest checkout appeared on the dashboard without a reload (order:new), and a vendor status transition broadcast order:status — with the protocol chain separately proven from ticket minting through HMAC room authentication to event delivery, including forged-ticket rejection.",
    ],
    verificationNote:
      "Verified hands-on on 30 Aug 2026: the test suite was executed locally (75/75 — executed result, which here matches the repository claim), and every transactional, security, AI, and realtime behavior cited above was exercised against the locally running application over HTTP and in a browser at 1440×900. The payment gateway is the repository's disclosed simulation: it reproduces the Stripe Connect wire contract (including HMAC webhook signatures delivered to the app's own endpoint) but moves no real money. One documented nuance is published as-is: the checkout route contains a server-side direct-settlement fallback that sets PAID without the webhook when internal self-delivery fails — disclosed in the repository's own ADR-10 trade-offs; the human-role PAID monopoly holds and was verified with a 403. No public deployment exists; all verification was local.",
    figures: [
      {
        src: "/artifacts/meridian-market/storefront.webp",
        alt: "Meridian Market storefront — hero, four storefronts, category filters, and the 12-item catalog",
        caption:
          "FIG. 01 — The storefront: four vendor storefronts over a 12-item catalog, category filters, and the Ask Aria assistant in the header — committed capture shipped with the repository.",
        width: 1280,
        height: 800,
      },
      {
        src: "/artifacts/meridian-market/product-transparency.webp",
        alt: "Product view for Aurora Wireless Headphones with rating, price, stock, and the per-vendor commission split note",
        caption:
          "FIG. 02 — Product view with the platform's transparency surfaced in the UI: of a $199.99 price, the vendor keeps $179.99 and the $20.00 marketplace fee (10%) is stated on the page.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/meridian-market/checkout-split.webp",
        alt: "Order confirmed page — payment captured, item line, and the payment split table with fee and vendor earnings",
        caption:
          "FIG. 03 — The settlement surface after a live guest checkout: the order was driven to PAID by the self-delivered HMAC-signed webhook, and the confirmation renders the exact integer-cents split ($399.98 → $40.00 + $359.98) with the PaymentIntent reference.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/meridian-market/ai-assistant.webp",
        alt: "Ask Aria assistant panel answering a budget query with three catalog-grounded product recommendations and cards",
        caption:
          "FIG. 04 — Aria answering a live budget query with the real LLM (degraded: false): three catalog products at catalog prices, no inventions, and the matching product cards attached from the retrieval step.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/meridian-market/vendor-realtime.webp",
        alt: "Vendor orders dashboard with Live updates on and socket-pushed orders appearing without reload",
        caption:
          "FIG. 05 — The vendor dashboard over the socket.io gateway connection: Live updates on, with a guest order pushed into the list in real time through the HMAC-ticket store room — no reload, no polling.",
        width: 1440,
        height: 900,
      },
      {
        src: "/artifacts/meridian-market/storefront-mobile.webp",
        alt: "Mobile rendering of the storefront at 390px with stacked hero and category chips",
        caption:
          "FIG. 06 — The same storefront at mobile width (390px), the repository's committed mobile capture: stacked hero, scrollable category chips, and the assistant action within thumb reach.",
        width: 390,
        height: 844,
      },
    ],
    limitations: [
      "The payment gateway is a simulation by design: it reproduces the Stripe Connect wire contract (intents, transfers, HMAC-signed webhooks) but moves no real money; no 3DS, card-error, or dispute surfaces are exercised, and the swap to the production SDK is documented but not performed.",
      "No public deployment exists — every result cited here was verified locally (Next.js dev server, realtime mini-service, and SQLite on one machine).",
      "The checkout route contains a documented direct-settlement fallback: if the internal self-delivery of the payment webhook fails, the server settles the order PAID directly (still server-only — no human role can set PAID, verified 403). The repository discloses this in ADR-10's trade-offs; this record publishes it rather than glossing it.",
      "The AI assistant is retrieval plus a single grounded LLM call — deliberately not agentic (no tool use, no autonomous loop), and its substring scorer misses paraphrases (\"cozy\" will not match an untagged \"blanket\"); retrieval quality depends on vendor tagging discipline.",
      "The catalog, storefronts, and orders are demo content — seeded products with AI-generated product imagery in a prototype marketplace; no real merchants, customers, or transactions are involved.",
      "Realtime delivery is at-most-twice (fire-and-forget with one retry) by design; the UI re-fetches on visibility change as the backstop, and room tickets are bearer-for-60-seconds (receiving events only).",
      "Rate limiting, caching, and idempotency-adjacent state are per-instance in memory (documented Redis swap points); SQLite's single-writer lock caps concurrent writes; the storefront is a single-route hash-based SPA, so inner views have no per-URL SSR/SEO.",
      "A dev-mode hydration mismatch warning (locale date rendering) was observed while serving in development mode; production behavior was not separately evaluated in this audit.",
    ],
    links: [
      {
        label: "github.com/rishav579/meridian-market",
        href: "https://github.com/rishav579/meridian-market",
        kind: "repository",
      },
      {
        label: "DECISIONS.md — twelve architecture decision records",
        href: "https://github.com/rishav579/meridian-market/blob/main/DECISIONS.md",
        kind: "docs",
      },
      {
        label: "mini-services/realtime — socket.io service with HMAC room tickets",
        href: "https://github.com/rishav579/meridian-market/blob/main/mini-services/realtime/index.ts",
        kind: "docs",
      },
    ],
  },
};

/** Explicit reserved slots — honest placeholders, no invented membership. */
const RESERVED: readonly EngineeringArtifact[] = [
  {
    id: "reserved-exercise",
    accessionId: "RR-EX-001",
    title: "Reserved record — Engineering Exercise",
    type: "exercise",
    categoryLabel: "Engineering Exercise",
    collections: ["engineering-exercises"],
    description:
      "Slot held for a focused engineering exercise. It will be cataloged here with a full dossier once its record is verified.",
    technologies: [],
    status: "RESERVED",
    topologyNodes: [],
    reserved: true,
  },
];

/** Archive order: verified records first, reserved slots after; authored
 *  order preserved within each tier (stable sort). A plain localeCompare put
 *  RR-EX-001 above the RR-SYS records — Phase 3 fix. IDs/content unchanged:
 *  RR-SYS-001 → RR-SYS-002 → RR-SYS-004 → RR-SYS-003 → RR-SYS-005 → RR-EX-001. */
const STATUS_TIER: Record<EngineeringArtifact["status"], number> = {
  VERIFIED: 0,
  RESERVED: 1,
};

export const ARTIFACTS: readonly EngineeringArtifact[] = [
  REPOPILOT,
  OWNARA,
  ENTERPRISE_AI_INVESTIGATION,
  DEMAND_RISK_ENGINE,
  MERIDIAN_MARKET,
  ...RESERVED,
].sort((a, b) => STATUS_TIER[a.status] - STATUS_TIER[b.status]);
