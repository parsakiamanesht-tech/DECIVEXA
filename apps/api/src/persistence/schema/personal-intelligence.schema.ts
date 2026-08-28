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

export type PersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferSelect;
export type NewPersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferInsert;
export type PersonalIntelligenceClaimVersionRow = typeof personalIntelligenceClaimVersions.$inferSelect;
export type NewPersonalIntelligenceClaimVersionRow =
  typeof personalIntelligenceClaimVersions.$inferInsert;
export type PersonalIntelligenceClaimConfirmationEventRow =
  typeof personalIntelligenceClaimConfirmationEvents.$inferSelect;
export type NewPersonalIntelligenceClaimConfirmationEventRow =
  typeof personalIntelligenceClaimConfirmationEvents.$inferInsert;
