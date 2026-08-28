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
  ],
);

export type PersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferSelect;
export type NewPersonalIntelligenceClaimRow = typeof personalIntelligenceClaims.$inferInsert;
export type PersonalIntelligenceClaimVersionRow = typeof personalIntelligenceClaimVersions.$inferSelect;
export type NewPersonalIntelligenceClaimVersionRow =
  typeof personalIntelligenceClaimVersions.$inferInsert;
