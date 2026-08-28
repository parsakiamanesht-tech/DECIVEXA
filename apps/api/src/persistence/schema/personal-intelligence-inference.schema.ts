import {
  pgSchema,
  integer,
  real,
  text,
  timestamp,
  uniqueIndex,
  primaryKey,
  check,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./identity.schema";
import { evidenceVersions } from "./evidence.schema";

// NOTE: this file deliberately does NOT import from
// ./personal-intelligence.schema.ts, even though
// personal_intelligence_claims and its claimType/valueKind enums live
// there. personal-intelligence.schema.ts needs to import
// `personalIntelligenceInferences` from *this* file (for the additive
// `inference_id` FK on personal_intelligence_claim_versions, §F/§N of the
// Contract) - importing in both directions would create a circular
// module dependency between the two schema files. The claimType/
// valueKind check-constraint values are therefore restated literally
// below (identical to PERSONAL_INTELLIGENCE_CLAIM_TYPES/
// PERSONAL_INTELLIGENCE_VALUE_KINDS), and the claim-context join table's
// `claimId` column (below) is a plain, non-FK-constrained column with
// ownership verified at the application/repository layer inside the same
// transaction - exactly the same "app-layer ownership check, no
// composite DB FK" pattern already established for `evidenceVersionId`
// on personal_intelligence_claim_versions itself.

// D3 Inference Provenance — Option B (Separate Immutable Inference Record)
// plus the §21 Founder Addendum (Status-Lifecycle Physical Realization),
// per docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md
// and docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md (§F/§N).
//
// Governing rule: the Inference row below is written exactly once, at
// creation, and is never UPDATEd or DELETEd as part of ordinary lifecycle
// handling (Invariant 3/5). Lifecycle state lives exclusively in the
// separate, append-only `personalIntelligenceInferenceLifecycleEvents`
// table further down this file - there is no `status`/`statusChangedAt`
// column on the inference row itself.

const decivexa = pgSchema("decivexa");

export const PERSONAL_INTELLIGENCE_INFERENCE_STATUSES = [
  "proposed",
  "confirmed",
  "rejected",
  "disputed",
  "stale",
] as const;
export type PersonalIntelligenceInferenceStatus = (typeof PERSONAL_INTELLIGENCE_INFERENCE_STATUSES)[number];

export const personalIntelligenceInferences = decivexa.table(
  "personal_intelligence_inferences",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Literal union, deliberately not imported from
    // personal-intelligence.schema.ts (see file-header note above) -
    // identical in value to PersonalIntelligenceClaimType there.
    claimType: text("claim_type").$type<
      | "identity_attribute"
      | "value"
      | "preference"
      | "capability"
      | "constraint"
      | "environment_context"
      | "strength"
      | "weakness"
      | "behavior_pattern"
    >().notNull(),
    // Identical in value to PersonalIntelligenceValueKind there.
    valueKind: text("value_kind").$type<"text" | "boolean" | "enum">().notNull(),
    valueText: text("value_text").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    producerCapabilityId: text("producer_capability_id").notNull(),
    producerCapabilityVersion: text("producer_capability_version").notNull(),
    producerProviderId: text("producer_provider_id").notNull(),
    producerModelId: text("producer_model_id").notNull(),
    modelReportedConfidence: real("model_reported_confidence"),
    systemAdjustedConfidence: real("system_adjusted_confidence"),
  },
  (table) => [
    // Required so the child tables below can enforce ownership with a real
    // composite FK, exactly mirroring
    // personal_intelligence_claim_versions_claim_owner_fk's precedent.
    uniqueIndex("personal_intelligence_inferences_id_user_id_unique").on(table.id, table.userId),
    check(
      "personal_intelligence_inferences_claim_type_check",
      sql`${table.claimType} in ('identity_attribute','value','preference','capability','constraint','environment_context','strength','weakness','behavior_pattern')`,
    ),
    check(
      "personal_intelligence_inferences_value_kind_check",
      sql`${table.valueKind} in ('text','boolean','enum')`,
    ),
    check(
      "personal_intelligence_inferences_model_reported_confidence_check",
      sql`${table.modelReportedConfidence} is null or (${table.modelReportedConfidence} >= 0 and ${table.modelReportedConfidence} <= 1)`,
    ),
    check(
      "personal_intelligence_inferences_system_adjusted_confidence_check",
      sql`${table.systemAdjustedConfidence} is null or (${table.systemAdjustedConfidence} >= 0 and ${table.systemAdjustedConfidence} <= 1)`,
    ),
  ],
);

// Mandatory direct-evidence grounding (Invariant 4). At least one row per
// inference is enforced at the application/repository layer, inside the
// same transaction as the inference insert (Contract §G/§I) - not by a
// database "minimum row count" constraint, which would require a trigger
// with no precedent anywhere in this codebase.
export const personalIntelligenceInferenceEvidenceReferences = decivexa.table(
  "personal_intelligence_inference_evidence_references",
  {
    inferenceId: text("inference_id").notNull(),
    evidenceVersionId: text("evidence_version_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.inferenceId, table.evidenceVersionId] }),
    foreignKey({
      columns: [table.inferenceId, table.userId],
      foreignColumns: [personalIntelligenceInferences.id, personalIntelligenceInferences.userId],
      name: "personal_intelligence_inference_evidence_references_inference_owner_fk",
    }).onDelete("restrict"),
    // Single-column FK, matching the existing, established precedent for
    // evidenceVersionId on personal_intelligence_claim_versions - Evidence
    // exposes no (id, userId) composite unique key, and this Contract does
    // not authorize adding one (Evidence schema is protected). Ownership
    // matching (same userId) is verified at the application/repository
    // layer instead, exactly as it already is for claim_versions.
    foreignKey({
      columns: [table.evidenceVersionId],
      foreignColumns: [evidenceVersions.id],
      name: "personal_intelligence_inference_evidence_references_evidence_version_fk",
    }).onDelete("restrict"),
  ],
);

// Optional ClaimVersion contextual grounding (architecture record §10).
// Zero or more rows; never counted toward the mandatory-evidence minimum.
// `claimId` is deliberately not FK-constrained against
// personal_intelligence_claims here (see file-header note above - doing
// so would require importing that table and create a circular module
// dependency between the two schema files). Ownership of the referenced
// claim is instead verified at the application/repository layer, inside
// the same transaction as the insert, exactly mirroring how
// `evidenceVersionId` ownership is already verified on
// personal_intelligence_claim_versions today.
export const personalIntelligenceInferenceClaimContext = decivexa.table(
  "personal_intelligence_inference_claim_context",
  {
    inferenceId: text("inference_id").notNull(),
    claimId: text("claim_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.inferenceId, table.claimId] }),
    foreignKey({
      columns: [table.inferenceId, table.userId],
      foreignColumns: [personalIntelligenceInferences.id, personalIntelligenceInferences.userId],
      name: "personal_intelligence_inference_claim_context_inference_owner_fk",
    }).onDelete("restrict"),
  ],
);

// Append-only lifecycle history (§21 Founder Addendum). One row per
// lifecycle transition, including the initial `proposed` entry created
// atomically together with the inference row. Never UPDATEd, never
// DELETEd. Effective status is derived by reading the row with the
// greatest `sequence` for a given inferenceId - never stored as a
// mutable column anywhere.
export const personalIntelligenceInferenceLifecycleEvents = decivexa.table(
  "personal_intelligence_inference_lifecycle_events",
  {
    id: text("id").primaryKey(),
    inferenceId: text("inference_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Computed the same way personal_intelligence_claim_versions.version is
    // computed (current-max-plus-one via INSERT ... SELECT), not a Postgres
    // identity/serial column, which has no precedent in this schema.
    sequence: integer("sequence").notNull(),
    fromStatus: text("from_status").$type<PersonalIntelligenceInferenceStatus | null>(),
    toStatus: text("to_status").$type<PersonalIntelligenceInferenceStatus>().notNull(),
    transitionedAt: timestamp("transitioned_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    // Database-enforced backstop against a race between two concurrent
    // transition attempts, mirroring
    // personal_intelligence_claim_versions_claim_id_version_unique exactly.
    uniqueIndex("personal_intelligence_inference_lifecycle_events_inference_id_sequence_unique").on(
      table.inferenceId,
      table.sequence,
    ),
    foreignKey({
      columns: [table.inferenceId, table.userId],
      foreignColumns: [personalIntelligenceInferences.id, personalIntelligenceInferences.userId],
      name: "personal_intelligence_inference_lifecycle_events_inference_owner_fk",
    }).onDelete("restrict"),
    check("personal_intelligence_inference_lifecycle_events_sequence_check", sql`${table.sequence} >= 1`),
    check(
      "personal_intelligence_inference_lifecycle_events_from_status_check",
      sql`${table.fromStatus} is null or ${table.fromStatus} in ('proposed','confirmed','rejected','disputed','stale')`,
    ),
    check(
      "personal_intelligence_inference_lifecycle_events_to_status_check",
      sql`${table.toStatus} in ('proposed','confirmed','rejected','disputed','stale')`,
    ),
  ],
);

export type PersonalIntelligenceInferenceRow = typeof personalIntelligenceInferences.$inferSelect;
export type NewPersonalIntelligenceInferenceRow = typeof personalIntelligenceInferences.$inferInsert;
export type PersonalIntelligenceInferenceEvidenceReferenceRow =
  typeof personalIntelligenceInferenceEvidenceReferences.$inferSelect;
export type PersonalIntelligenceInferenceClaimContextRow =
  typeof personalIntelligenceInferenceClaimContext.$inferSelect;
export type PersonalIntelligenceInferenceLifecycleEventRow =
  typeof personalIntelligenceInferenceLifecycleEvents.$inferSelect;
export type NewPersonalIntelligenceInferenceLifecycleEventRow =
  typeof personalIntelligenceInferenceLifecycleEvents.$inferInsert;
