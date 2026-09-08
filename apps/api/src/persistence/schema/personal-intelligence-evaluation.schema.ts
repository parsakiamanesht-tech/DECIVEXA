import { pgSchema, integer, real, text, timestamp, uniqueIndex, check, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./identity.schema";
import { evidenceVersions } from "./evidence.schema";

// Derivation Trace / Provenance — Increment 1: Evaluation & Evaluation
// Standard Foundation (Founder Implementation Authorization, per
// docs/gates/PERSONAL-INTELLIGENCE-DERIVATION-TRACE-PROVENANCE-ARCHITECTURE-CONTRACT.md).
//
// Scope of this file: Evaluation Standard identity/version and Evaluation
// itself, together with the Evaluation's mandatory EvidenceVersion-set
// lineage. Semantic Conclusion, BSS, cross-Claim Evaluation, and any AI
// generation/execution are explicitly OUT OF SCOPE and not implemented
// here or anywhere in this increment (Contract §2, §13; Increment 1
// authorization §1).
//
// FD-DT-02 (Hybrid / Option C): every lineage relationship below is a
// named, FK-constrained, domain-native table — no generic/polymorphic
// `(type, id)` provenance table is introduced, mirroring the existing
// Evidence/Claim/Inference precedent exactly.

const decivexa = pgSchema("decivexa");

// --- Evaluation Standard ---------------------------------------------
//
// Identity/version split, mirroring Evidence and Claim exactly (Contract
// §9: "a Standard's material criteria may be revised over time; each
// revision is a distinct, historically addressable version... attached
// to the specific version, not to a mutable 'current' pointer"). No
// structured decomposition of "purpose/stakes/threshold/relevance" is
// introduced — the Contract itself (and the earlier Design Report §9)
// treats these as illustrative-only, not a prescribed schema; `criteria`
// below is the single freeform field carrying whatever material criteria
// a given version records, deliberately not over-specified in this
// increment.
export const personalIntelligenceEvaluationStandards = decivexa.table(
  "personal_intelligence_evaluation_standards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_evaluation_standards_id_user_id_unique").on(
      table.id,
      table.userId,
    ),
  ],
);

export const personalIntelligenceEvaluationStandardVersions = decivexa.table(
  "personal_intelligence_evaluation_standard_versions",
  {
    id: text("id").primaryKey(),
    standardId: text("standard_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    // Material criteria as of this version (Contract §9). Immutable once
    // created — a later revision is a new row, never an update to this
    // one (Contract §9 "Historical stability": "a historical Evaluation
    // MUST NOT silently resolve against a later Evaluation Standard
    // version").
    criteria: text("criteria").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex(
      "personal_intelligence_evaluation_standard_versions_standard_id_version_unique",
    ).on(table.standardId, table.version),
    foreignKey({
      columns: [table.standardId, table.userId],
      foreignColumns: [
        personalIntelligenceEvaluationStandards.id,
        personalIntelligenceEvaluationStandards.userId,
      ],
      name: "personal_intelligence_evaluation_standard_versions_standard_owner_fk",
    }).onDelete("restrict"),
    check(
      "personal_intelligence_evaluation_standard_versions_version_check",
      sql`${table.version} >= 1`,
    ),
  ],
);

// --- Evaluation --------------------------------------------------------

// Evidential Sufficiency result (Contract §3/§9 of Increment-1
// authorization): kept as its own narrow enum, never merged with
// confidence, evidential weight, or any other score (Contract §9 "do not
// collapse... into one generic score").
export const PERSONAL_INTELLIGENCE_EVALUATION_RESULTS = ["sufficient", "insufficient"] as const;
export type PersonalIntelligenceEvaluationResult =
  (typeof PERSONAL_INTELLIGENCE_EVALUATION_RESULTS)[number];

// Evaluator type (Contract §8: "human, system-deterministic, or
// AI-participated"). "ai" here never implies AI generation/execution
// occurred within this codebase — Gate 7 remains closed; this value only
// records, structurally, that an externally-supplied or future
// AI-derived result is being represented, exactly mirroring how
// Inference's existing producer/model fields already work without any
// AI ever having been invoked by this repository.
export const PERSONAL_INTELLIGENCE_EVALUATOR_TYPES = ["human", "system_deterministic", "ai"] as const;
export type PersonalIntelligenceEvaluatorType =
  (typeof PERSONAL_INTELLIGENCE_EVALUATOR_TYPES)[number];

// Single-Claim scope only (FD-DT-03): `claimVersionId` is a single-column
// FK, ownership (that the referenced ClaimVersion belongs to this row's
// own userId) verified at the application/repository layer inside the
// same transaction — the same established pattern already used for
// evidenceVersionId/inferenceId on personal_intelligence_claim_versions
// and for sourceClaimVersionId/targetClaimVersionId on Relationship,
// since claim_versions exposes no (id, userId) composite unique key to
// FK against.
//
// Correction/supersession (Contract §14; D3 precedent: "re-evaluation
// creates a new inference record, never a mutation of the original"):
// `supersedesEvaluationId` is a nullable self-reference. A correction
// creates an entirely new Evaluation row referencing the one it
// supersedes; the original row is never updated or deleted.
export const personalIntelligenceEvaluations = decivexa.table(
  "personal_intelligence_evaluations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    claimVersionId: text("claim_version_id").notNull(),
    evaluationStandardVersionId: text("evaluation_standard_version_id").notNull(),
    result: text("result").$type<PersonalIntelligenceEvaluationResult>().notNull(),
    evaluatorType: text("evaluator_type").$type<PersonalIntelligenceEvaluatorType>().notNull(),
    // AI provenance — nullable, populated only when evaluatorType = "ai"
    // (app-layer enforced; no DB coupling constraint introduced in this
    // increment, kept minimal per the authorized scope). Mirrors
    // Inference's existing producer/model field shape exactly.
    producerCapabilityId: text("producer_capability_id"),
    producerCapabilityVersion: text("producer_capability_version"),
    producerProviderId: text("producer_provider_id"),
    producerModelId: text("producer_model_id"),
    modelReportedConfidence: real("model_reported_confidence"),
    systemAdjustedConfidence: real("system_adjusted_confidence"),
    supersedesEvaluationId: text("supersedes_evaluation_id"),
    evaluatedAt: timestamp("evaluated_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_evaluations_id_user_id_unique").on(table.id, table.userId),
    foreignKey({
      columns: [table.evaluationStandardVersionId],
      foreignColumns: [personalIntelligenceEvaluationStandardVersions.id],
      name: "personal_intelligence_evaluations_standard_version_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.supersedesEvaluationId],
      foreignColumns: [table.id],
      name: "personal_intelligence_evaluations_supersedes_fk",
    }).onDelete("restrict"),
    check(
      "personal_intelligence_evaluations_result_check",
      sql`${table.result} in ('sufficient','insufficient')`,
    ),
    check(
      "personal_intelligence_evaluations_evaluator_type_check",
      sql`${table.evaluatorType} in ('human','system_deterministic','ai')`,
    ),
  ],
);

// Mandatory EvidenceVersion-set lineage (Contract §7/§10 of Increment-1
// authorization: "the exact EvidenceVersion set considered" must be
// recoverable). At least one row per Evaluation is enforced at the
// application/repository layer inside the same transaction as the
// Evaluation insert — the same established pattern already proven by
// personalIntelligenceInferenceEvidenceReferences, not a database
// "minimum row count" constraint (no precedent for that anywhere in this
// codebase).
export const personalIntelligenceEvaluationEvidenceReferences = decivexa.table(
  "personal_intelligence_evaluation_evidence_references",
  {
    evaluationId: text("evaluation_id").notNull(),
    evidenceVersionId: text("evidence_version_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
  },
  (table) => [
    // Explicitly named (rather than left to drizzle-orm's auto-generated
    // "<table>_<col1>_<col2>_pk" convention) because the auto-generated
    // name for this composite key and the explicit
    // "..._evaluation_owner_fk" name below share an identical 63-character
    // prefix once truncated to PostgreSQL's identifier limit ("evaluation"
    // is one character longer than the Inference precedent's "inference",
    // which shifts the truncation boundary onto a shared substring) —
    // causing a real "constraint already exists" collision on migration
    // apply. This name changes only the identifier; the primary key's
    // columns, semantics, and the FK's own name are unchanged.
    primaryKey({
      columns: [table.evaluationId, table.evidenceVersionId],
      name: "personal_intelligence_evaluation_evidence_references_pk",
    }),
    foreignKey({
      columns: [table.evaluationId, table.userId],
      foreignColumns: [personalIntelligenceEvaluations.id, personalIntelligenceEvaluations.userId],
      name: "personal_intelligence_evaluation_evidence_references_evaluation_owner_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.evidenceVersionId],
      foreignColumns: [evidenceVersions.id],
      name: "personal_intelligence_evaluation_evidence_references_evidence_version_fk",
    }).onDelete("restrict"),
  ],
);

export type PersonalIntelligenceEvaluationStandardRow =
  typeof personalIntelligenceEvaluationStandards.$inferSelect;
export type NewPersonalIntelligenceEvaluationStandardRow =
  typeof personalIntelligenceEvaluationStandards.$inferInsert;
export type PersonalIntelligenceEvaluationStandardVersionRow =
  typeof personalIntelligenceEvaluationStandardVersions.$inferSelect;
export type NewPersonalIntelligenceEvaluationStandardVersionRow =
  typeof personalIntelligenceEvaluationStandardVersions.$inferInsert;
export type PersonalIntelligenceEvaluationRow = typeof personalIntelligenceEvaluations.$inferSelect;
export type NewPersonalIntelligenceEvaluationRow = typeof personalIntelligenceEvaluations.$inferInsert;
export type PersonalIntelligenceEvaluationEvidenceReferenceRow =
  typeof personalIntelligenceEvaluationEvidenceReferences.$inferSelect;
export type NewPersonalIntelligenceEvaluationEvidenceReferenceRow =
  typeof personalIntelligenceEvaluationEvidenceReferences.$inferInsert;
