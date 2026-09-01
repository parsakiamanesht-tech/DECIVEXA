import {
  pgSchema,
  integer,
  real,
  text,
  timestamp,
  uniqueIndex,
  check,
  foreignKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./identity.schema";
import { evidenceVersions } from "./evidence.schema";
import { personalIntelligenceInferences } from "./personal-intelligence-inference.schema";

const decivexa = pgSchema("decivexa");

export const PERSONAL_INTELLIGENCE_CLAIM_TYPES = [
  "identity_attribute",
  "value",
  "preference",
  "capability",
  "constraint",
  "environment_context",
  "strength",
  "weakness",
  "behavior_pattern",
] as const;
export type PersonalIntelligenceClaimType = (typeof PERSONAL_INTELLIGENCE_CLAIM_TYPES)[number];

export const PERSONAL_INTELLIGENCE_VALUE_KINDS = ["text", "boolean", "enum"] as const;
export type PersonalIntelligenceValueKind = (typeof PERSONAL_INTELLIGENCE_VALUE_KINDS)[number];

export const PERSONAL_INTELLIGENCE_PROVENANCE = ["declared", "observed"] as const;
export type PersonalIntelligenceProvenance = (typeof PERSONAL_INTELLIGENCE_PROVENANCE)[number];

export const PERSONAL_INTELLIGENCE_LIFECYCLE_STATES = [
  "active",
  "superseded",
  "corrected",
  "revoked",
  "disputed",
] as const;
export type PersonalIntelligenceLifecycle = (typeof PERSONAL_INTELLIGENCE_LIFECYCLE_STATES)[number];

// PIC Claim Ontology / Taxonomy, Option 2 (Implementation Increment
// Contract §3.1, docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-*).
export const PERSONAL_INTELLIGENCE_EVIDENCE_LINKAGE_STATES = [
  "linked",
  "self_reported_no_evidence_required",
  "linkage_pending",
] as const;
export type PersonalIntelligenceEvidenceLinkageState =
  (typeof PERSONAL_INTELLIGENCE_EVIDENCE_LINKAGE_STATES)[number];

// PIC Claim Ontology / Taxonomy, Option 2 (Implementation Increment
// Contract §3.3.2).
export const PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_ACTIONS = ["confirmed", "unconfirmed"] as const;
export type PersonalIntelligenceClaimConfirmationAction =
  (typeof PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_ACTIONS)[number];

// Cross-Claim Matching — Relationship + Relationship Evidence
// (Implementation Increment Contract §6/§11, docs/gates/
// PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Axis 1 — Relationship Type. FORMALIZED BY THE CONTRACT, not
// independently Founder-approved by name before it — only the three-axis
// *structure* is Founder-approved (Decision 4). `same_claim` and
// `unrelated` are deliberately excluded per explicit Founder decision
// (Contract §11.1); `same_subject`/`same_attribute` remain structural
// predicates and are never values here either.
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_TYPES = [
  "successive_state",
  "refinement",
  "contradiction",
  "contextual_variation",
  "related_fact",
] as const;
export type PersonalIntelligenceRelationshipType =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_TYPES)[number];

// Axis 2 — Certainty (Contract §11.2, FORMALIZED BY THE CONTRACT).
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_CERTAINTIES = [
  "certain",
  "uncertain",
  "unknown",
] as const;
export type PersonalIntelligenceRelationshipCertainty =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_CERTAINTIES)[number];

// Axis 3 — Confirmation State (Contract §11.3, FORMALIZED BY THE
// CONTRACT). Data only in this increment - no workflow/mechanism in this
// module ever transitions a row from one value to another after creation.
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_STATES = [
  "not_required",
  "pending",
  "confirmed",
  "rejected",
] as const;
export type PersonalIntelligenceRelationshipConfirmationState =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_STATES)[number];

// Provenance for Relationship and Relationship Evidence records (Contract
// §10/§12, FORMALIZED BY THE CONTRACT) - same enum reused by both tables.
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_PROVENANCES = [
  "ai_hypothesis",
  "system_derived",
  "user_declared",
] as const;
export type PersonalIntelligenceRelationshipProvenance =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_PROVENANCES)[number];

// Cross-Claim Matching — Matching-Hypothesis Confirmation (Implementation
// Increment Contract §9/§11, docs/gates/
// PERSONAL-INTELLIGENCE-MATCHING-HYPOTHESIS-CONFIRMATION-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Event action vocabulary — not a copy of C3's confirmed|unconfirmed,
// since Relationship confirmation is a four-value domain
// (not_required/pending/confirmed/rejected), not a boolean toggle.
// not_required is never a valid event action.
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_ACTIONS = [
  "pending",
  "confirmed",
  "rejected",
] as const;
export type PersonalIntelligenceRelationshipConfirmationAction =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_ACTIONS)[number];

// Actor model (Contract §10.2, corrected per Final Founder Review
// finding F-4): this Increment authorizes only the "user" actor — no
// "system" or "ai" value exists in this Increment's domain.
export const PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_ACTORS = ["user"] as const;
export type PersonalIntelligenceRelationshipConfirmationActor =
  (typeof PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_ACTORS)[number];

export const personalIntelligenceClaims = decivexa.table(
  "personal_intelligence_claims",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    claimType: text("claim_type").$type<PersonalIntelligenceClaimType>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_claims_id_user_id_unique").on(table.id, table.userId),
    check(
      "personal_intelligence_claims_claim_type_check",
      sql`${table.claimType} in ('identity_attribute','value','preference','capability','constraint','environment_context','strength','weakness','behavior_pattern')`,
    ),
  ],
);

export const personalIntelligenceClaimVersions = decivexa.table(
  "personal_intelligence_claim_versions",
  {
    id: text("id").primaryKey(),
    claimId: text("claim_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    valueKind: text("value_kind").$type<PersonalIntelligenceValueKind>().notNull(),
    valueText: text("value_text").notNull(),
    provenance: text("provenance").$type<PersonalIntelligenceProvenance>().notNull(),
    confidence: real("confidence").notNull(),
    lifecycle: text("lifecycle")
      .$type<PersonalIntelligenceLifecycle>()
      .notNull()
      .default("active"),
    evidenceVersionId: text("evidence_version_id"),
    // Additive, nullable, D3 (docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md
    // §F/§N): an explicit promotion of an Inference into this claim
    // version may set this to the originating inference's id. Out of
    // scope for this increment: no repository write-path (create()/
    // appendCorrection()) sets this column yet - it is always null until
    // a future, separately-scoped increment adds that write path. Its
    // presence here is the one schema change §F requires now.
    inferenceId: text("inference_id"),
    // Additive, PIC Claim Ontology / Taxonomy Option 2 (Implementation
    // Increment Contract §3.1). Set once at version-creation time by the
    // write path, never mutated afterward. Coupled 1:1 with
    // evidenceVersionId by the check constraint below: 'linked' iff
    // evidenceVersionId is non-null.
    evidenceLinkageState: text("evidence_linkage_state")
      .$type<PersonalIntelligenceEvidenceLinkageState>()
      .notNull(),
    // Temporal Validity axis (Implementation Increment Contract,
    // docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md
    // §9). Both nullable, no defaults - a database default or an
    // application-generated "now" fallback would silently manufacture a
    // value the caller never chose, violating the "null means only 'not
    // established'" semantics this axis exists to guarantee. Populated
    // only by explicit caller input on create()/appendCorrection()
    // (Option A - Always Explicit) - never derived from observedAt,
    // acceptedAt, createdAt, lifecycle, evidence, or provenance.
    effectiveFrom: timestamp("effective_from", { withTimezone: true }),
    effectiveTo: timestamp("effective_to", { withTimezone: true }),
    // Claim-level Context (Implementation Increment Contract,
    // docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md
    // §18/§20). Both nullable text, no defaults, no enum - no evidenced
    // fixed vocabulary exists for either dimension. Populated only by
    // explicit caller input on create()/appendCorrection() (Always
    // Explicit) - never derived from Temporal Validity, lifecycle,
    // provenance, or evidence timestamps. No new sovereignty column is
    // introduced for Context - it is governed by this row's existing
    // provenance/inferenceId/confirmation apparatus (Contract §7).
    situationSetting: text("situation_setting"),
    timeOfDay: text("time_of_day"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_claim_versions_claim_id_version_unique").on(
      table.claimId,
      table.version,
    ),
    foreignKey({
      columns: [table.claimId, table.userId],
      foreignColumns: [personalIntelligenceClaims.id, personalIntelligenceClaims.userId],
      name: "personal_intelligence_claim_versions_claim_owner_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.evidenceVersionId],
      foreignColumns: [evidenceVersions.id],
      name: "personal_intelligence_claim_versions_evidence_version_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.inferenceId],
      foreignColumns: [personalIntelligenceInferences.id],
      name: "personal_intelligence_claim_versions_inference_fk",
    }).onDelete("restrict"),
    check("personal_intelligence_claim_versions_version_check", sql`${table.version} >= 1`),
    check(
      "personal_intelligence_claim_versions_value_kind_check",
      sql`${table.valueKind} in ('text','boolean','enum')`,
    ),
    check(
      "personal_intelligence_claim_versions_provenance_check",
      sql`${table.provenance} in ('declared','observed')`,
    ),
    check(
      "personal_intelligence_claim_versions_confidence_check",
      sql`${table.confidence} >= 0 and ${table.confidence} <= 1`,
    ),
    check(
      "personal_intelligence_claim_versions_lifecycle_check",
      sql`${table.lifecycle} in ('active','superseded','corrected','revoked','disputed')`,
    ),
    check(
      "personal_intelligence_claim_versions_evidence_linkage_state_check",
      sql`${table.evidenceLinkageState} in ('linked','self_reported_no_evidence_required','linkage_pending')`,
    ),
    // Mandatory 1:1 coupling (Implementation Increment Contract §3.1):
    // 'linked' if and only if evidenceVersionId is non-null. Enforced here,
    // at the database layer, not by application code alone.
    check(
      "personal_intelligence_claim_versions_evidence_linkage_coupling_check",
      sql`(${table.evidenceLinkageState} = 'linked' and ${table.evidenceVersionId} is not null) or (${table.evidenceLinkageState} <> 'linked' and ${table.evidenceVersionId} is null)`,
    ),
  ],
);

// PIC Claim Ontology / Taxonomy, Option 2 - Claim User Confirmation, C3
// (Implementation Increment Contract §3.3/§3.3.2, docs/gates/
// PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-TAXONOMY-*). Append-only
// confirmation-event log, structurally analogous to D3 §21's
// personal_intelligence_inference_lifecycle_events - never updated, never
// deleted. Deliberately references the specific, immutable ClaimVersion
// that was confirmed (`claimVersionId`), not only the logical Claim
// identity (`claimId`, retained for cross-version audit queries) - a
// confirmation of one ClaimVersion must never silently carry forward to a
// later version created by a correction or supersession (Contract §3.3.1).
// Effective confirmation state is derived (see
// deriveEffectiveConfirmation in personal-intelligence-claim-confirmation.model.ts)
// from the event with the greatest `sequence` for a given claimVersionId -
// never stored as a mutable column anywhere, and never on the immutable
// ClaimVersion row itself (C1, a mutable boolean there, was explicitly
// rejected by Founder decision in favor of this table).
export const personalIntelligenceClaimConfirmationEvents = decivexa.table(
  "personal_intelligence_claim_confirmation_events",
  {
    id: text("id").primaryKey(),
    claimId: text("claim_id").notNull(),
    // Single-column FK to personal_intelligence_claim_versions.id, with
    // ownership (that the referenced ClaimVersion belongs to both this
    // userId and this claimId) verified at the application/repository
    // layer inside the same transaction - the same established pattern
    // already used for evidenceVersionId/inferenceId on
    // personal_intelligence_claim_versions itself, since claim_versions
    // exposes no (id, userId) composite unique key to FK against.
    claimVersionId: text("claim_version_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Current-max-plus-one per claimId, allocated the same
    // INSERT...SELECT way as every other sequence column in this schema -
    // not a Postgres identity/serial column.
    sequence: integer("sequence").notNull(),
    action: text("action").$type<PersonalIntelligenceClaimConfirmationAction>().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_claim_confirmation_events_claim_id_sequence_unique").on(
      table.claimId,
      table.sequence,
    ),
    foreignKey({
      columns: [table.claimId, table.userId],
      foreignColumns: [personalIntelligenceClaims.id, personalIntelligenceClaims.userId],
      name: "personal_intelligence_claim_confirmation_events_claim_owner_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.claimVersionId],
      foreignColumns: [personalIntelligenceClaimVersions.id],
      name: "personal_intelligence_claim_confirmation_events_claim_version_fk",
    }).onDelete("restrict"),
    check("personal_intelligence_claim_confirmation_events_sequence_check", sql`${table.sequence} >= 1`),
    check(
      "personal_intelligence_claim_confirmation_events_action_check",
      sql`${table.action} in ('confirmed','unconfirmed')`,
    ),
  ],
);

// Cross-Claim Matching — Relationship (Implementation Increment Contract
// §10/§13, docs/gates/PERSONAL-INTELLIGENCE-RELATIONSHIP-EVIDENCE-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Fully immutable core table: every column is set exactly once at INSERT
// time and never updated (Contract §13 - "a variant of Option B/C,
// deliberately minimized"). No append-only state-event table is created
// for certainty/confirmationState in this increment, because nothing this
// Contract authorizes ever needs to change either after creation - a
// future, separately-authorized Matching-Hypothesis Confirmation
// increment would define its own additive mechanism for that, without
// altering this table (Contract §13/§18). sourceClaimVersionId/
// targetClaimVersionId are single-column FKs to
// personal_intelligence_claim_versions.id, with ownership (that both
// referenced ClaimVersions belong to this row's own userId) verified at
// the application/repository layer inside the same transaction - the same
// established pattern already used for evidenceVersionId/inferenceId on
// personal_intelligence_claim_versions itself, since claim_versions
// exposes no (id, userId) composite unique key to FK against.
export const personalIntelligenceRelationships = decivexa.table(
  "personal_intelligence_relationships",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    sourceClaimVersionId: text("source_claim_version_id").notNull(),
    targetClaimVersionId: text("target_claim_version_id").notNull(),
    relationshipType: text("relationship_type")
      .$type<PersonalIntelligenceRelationshipType>()
      .notNull(),
    certainty: text("certainty").$type<PersonalIntelligenceRelationshipCertainty>().notNull(),
    confirmationState: text("confirmation_state")
      .$type<PersonalIntelligenceRelationshipConfirmationState>()
      .notNull(),
    provenance: text("provenance").$type<PersonalIntelligenceRelationshipProvenance>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    // Required so personal_intelligence_relationship_evidence's composite
    // ownership FK below can reference (id, user_id) - mirrors
    // personal_intelligence_claims_id_user_id_unique exactly (a plain
    // PRIMARY KEY on id alone does not, by itself, constitute a unique
    // constraint on the pair; Postgres requires an explicit one for a
    // composite FK to target it).
    uniqueIndex("personal_intelligence_relationships_id_user_id_unique").on(
      table.id,
      table.userId,
    ),
    foreignKey({
      columns: [table.sourceClaimVersionId],
      foreignColumns: [personalIntelligenceClaimVersions.id],
      name: "personal_intelligence_relationships_source_claim_version_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.targetClaimVersionId],
      foreignColumns: [personalIntelligenceClaimVersions.id],
      name: "personal_intelligence_relationships_target_claim_version_fk",
    }).onDelete("restrict"),
    check(
      "personal_intelligence_relationships_relationship_type_check",
      sql`${table.relationshipType} in ('successive_state','refinement','contradiction','contextual_variation','related_fact')`,
    ),
    check(
      "personal_intelligence_relationships_certainty_check",
      sql`${table.certainty} in ('certain','uncertain','unknown')`,
    ),
    check(
      "personal_intelligence_relationships_confirmation_state_check",
      sql`${table.confirmationState} in ('not_required','pending','confirmed','rejected')`,
    ),
    check(
      "personal_intelligence_relationships_provenance_check",
      sql`${table.provenance} in ('ai_hypothesis','system_derived','user_declared')`,
    ),
  ],
);

// Cross-Claim Matching — Relationship Evidence (Implementation Increment
// Contract §12/§13). An independent abstraction, distinct from Claim
// evidence and from candidate-generation signal (Decision 5). Append-only
// event log, structurally analogous to
// personal_intelligence_claim_confirmation_events above - never updated,
// never deleted. evidenceVersionId is a nullable *reference* to an
// existing evidence_versions row, never a repurposing of that schema
// (Contract §12) - null when this evidence is a system-derived
// deterministic-check result with nothing in evidence_versions to cite.
export const personalIntelligenceRelationshipEvidence = decivexa.table(
  "personal_intelligence_relationship_evidence",
  {
    id: text("id").primaryKey(),
    // Single-column FK is not possible for ownership here either -
    // personal_intelligence_relationships exposes no (id, userId)
    // composite unique key - so ownership is enforced via the composite
    // foreign key below instead, mirroring
    // personal_intelligence_claim_confirmation_events_claim_owner_fk.
    relationshipId: text("relationship_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Current-max-plus-one per relationshipId, allocated the same
    // INSERT...SELECT way as every other sequence column in this schema -
    // not a Postgres identity/serial column.
    sequence: integer("sequence").notNull(),
    description: text("description").notNull(),
    evidenceVersionId: text("evidence_version_id"),
    provenance: text("provenance").$type<PersonalIntelligenceRelationshipProvenance>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_intelligence_relationship_evidence_relationship_id_sequence_unique").on(
      table.relationshipId,
      table.sequence,
    ),
    foreignKey({
      columns: [table.relationshipId, table.userId],
      foreignColumns: [personalIntelligenceRelationships.id, personalIntelligenceRelationships.userId],
      name: "personal_intelligence_relationship_evidence_relationship_owner_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.evidenceVersionId],
      foreignColumns: [evidenceVersions.id],
      name: "personal_intelligence_relationship_evidence_evidence_version_fk",
    }).onDelete("restrict"),
    check(
      "personal_intelligence_relationship_evidence_sequence_check",
      sql`${table.sequence} >= 1`,
    ),
    check(
      "personal_intelligence_relationship_evidence_provenance_check",
      sql`${table.provenance} in ('ai_hypothesis','system_derived','user_declared')`,
    ),
  ],
);

// Cross-Claim Matching — Matching-Hypothesis Confirmation (Implementation
// Increment Contract §9/§10/§11). An independent confirmation mechanism
// (Decision 6), separate from C3 Claim Confirmation and D3 Inference
// Confirmation. Append-only event log, structurally analogous to
// personal_intelligence_claim_confirmation_events and
// personal_intelligence_relationship_evidence above — never updated,
// never deleted. Effective confirmation state is derived (see
// deriveEffectiveConfirmationState in
// personal-intelligence-relationship-confirmation.model.ts) from the
// event with the greatest `sequence` for a given relationshipId, falling
// back to the Relationship's own creation-time confirmationState when no
// event exists yet — never stored as a mutable column anywhere, and
// personal_intelligence_relationships.confirmationState itself is never
// updated after Relationship creation (Contract §10 — this table does
// not reopen that already-shipped immutability). actor is currently
// constrained to exactly "user" (Contract §10.2/§17, Final Founder
// Review finding F-4) — no system or AI actor is authorized by this
// Increment.
export const personalIntelligenceRelationshipConfirmationEvents = decivexa.table(
  "personal_intelligence_relationship_confirmation_events",
  {
    id: text("id").primaryKey(),
    // Single-column FK is not possible for ownership here either -
    // personal_intelligence_relationships exposes no bare (id) target
    // suitable for composite ownership matching - so ownership is
    // enforced via the composite foreign key below instead, mirroring
    // personal_intelligence_relationship_evidence_relationship_owner_fk.
    relationshipId: text("relationship_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Current-max-plus-one per relationshipId, allocated the same
    // INSERT...SELECT way as every other sequence column in this schema -
    // not a Postgres identity/serial column.
    sequence: integer("sequence").notNull(),
    action: text("action").$type<PersonalIntelligenceRelationshipConfirmationAction>().notNull(),
    actor: text("actor").$type<PersonalIntelligenceRelationshipConfirmationActor>().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex(
      "personal_intelligence_relationship_confirmation_events_relationship_id_sequence_unique",
    ).on(table.relationshipId, table.sequence),
    foreignKey({
      columns: [table.relationshipId, table.userId],
      foreignColumns: [personalIntelligenceRelationships.id, personalIntelligenceRelationships.userId],
      name: "personal_intelligence_relationship_confirmation_events_relationship_owner_fk",
    }).onDelete("restrict"),
    check(
      "personal_intelligence_relationship_confirmation_events_sequence_check",
      sql`${table.sequence} >= 1`,
    ),
    check(
      "personal_intelligence_relationship_confirmation_events_action_check",
      sql`${table.action} in ('pending','confirmed','rejected')`,
    ),
    check(
      "personal_intelligence_relationship_confirmation_events_actor_check",
      sql`${table.actor} in ('user')`,
    ),
  ],
);

export type PersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferSelect;
export type NewPersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferInsert;
export type PersonalIntelligenceClaimVersionRow = typeof personalIntelligenceClaimVersions.$inferSelect;
export type NewPersonalIntelligenceClaimVersionRow =
  typeof personalIntelligenceClaimVersions.$inferInsert;
export type PersonalIntelligenceClaimConfirmationEventRow =
  typeof personalIntelligenceClaimConfirmationEvents.$inferSelect;
export type NewPersonalIntelligenceClaimConfirmationEventRow =
  typeof personalIntelligenceClaimConfirmationEvents.$inferInsert;
export type PersonalIntelligenceRelationshipRow = typeof personalIntelligenceRelationships.$inferSelect;
export type NewPersonalIntelligenceRelationshipRow =
  typeof personalIntelligenceRelationships.$inferInsert;
export type PersonalIntelligenceRelationshipEvidenceRow =
  typeof personalIntelligenceRelationshipEvidence.$inferSelect;
export type NewPersonalIntelligenceRelationshipEvidenceRow =
  typeof personalIntelligenceRelationshipEvidence.$inferInsert;
export type PersonalIntelligenceRelationshipConfirmationEventRow =
  typeof personalIntelligenceRelationshipConfirmationEvents.$inferSelect;
export type NewPersonalIntelligenceRelationshipConfirmationEventRow =
  typeof personalIntelligenceRelationshipConfirmationEvents.$inferInsert;
