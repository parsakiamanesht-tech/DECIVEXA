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

const decivexa = pgSchema("decivexa");

export const EVIDENCE_PROVENANCE = ["declared", "observed", "measured"] as const;
export type EvidenceProvenance = (typeof EVIDENCE_PROVENANCE)[number];

export const EVIDENCE_LIFECYCLE_STATES = [
  "active",
  "superseded",
  "corrected",
  "revoked",
  "disputed",
] as const;
export type EvidenceLifecycleState = (typeof EVIDENCE_LIFECYCLE_STATES)[number];

export const evidence = decivexa.table(
  "evidence",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("evidence_id_user_id_unique").on(table.id, table.userId),
  ],
);

export const evidenceVersions = decivexa.table(
  "evidence_versions",
  {
    id: text("id").primaryKey(),
    evidenceId: text("evidence_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    provenance: text("provenance").$type<EvidenceProvenance>().notNull(),
    lifecycle: text("lifecycle")
      .$type<EvidenceLifecycleState>()
      .notNull()
      .default("active"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull(),
    confidence: real("confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("evidence_versions_evidence_version_unique").on(
      table.evidenceId,
      table.version,
    ),
    foreignKey({
      columns: [table.evidenceId, table.userId],
      foreignColumns: [evidence.id, evidence.userId],
      name: "evidence_versions_evidence_owner_fk",
    }).onDelete("restrict"),
    check(
      "evidence_versions_version_check",
      sql`${table.version} >= 1`,
    ),
    check(
      "evidence_versions_provenance_check",
      sql`${table.provenance} in ('declared','observed','measured')`,
    ),
    check(
      "evidence_versions_lifecycle_check",
      sql`${table.lifecycle} in ('active','superseded','corrected','revoked','disputed')`,
    ),
  ],
);

export type EvidenceRow = typeof evidence.$inferSelect;
export type NewEvidenceRow = typeof evidence.$inferInsert;
export type EvidenceVersionRow = typeof evidenceVersions.$inferSelect;
export type NewEvidenceVersionRow = typeof evidenceVersions.$inferInsert;
