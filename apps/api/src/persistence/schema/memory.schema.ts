import {
  pgSchema,
  boolean,
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

export const MEMORY_PROVENANCE = ["declared", "observed"] as const;
export type MemoryProvenance = (typeof MEMORY_PROVENANCE)[number];

export const MEMORY_LIFECYCLE_STATES = ["active", "corrected", "deleted"] as const;
export type MemoryLifecycleState = (typeof MEMORY_LIFECYCLE_STATES)[number];

// Value-encoding-kind discriminator for the unified content/reference value
// slot. Founder-authorized as exactly these two values (Memory Schema
// Implementation Blocker Resolution, Blocker 1) - independently declared
// from `PersonalIntelligenceValueKind`, never shared with it.
export const MEMORY_VALUE_KINDS = ["content", "reference"] as const;
export type MemoryValueKind = (typeof MEMORY_VALUE_KINDS)[number];

export const memoryRecords = decivexa.table(
  "memory_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("memory_records_id_user_id_unique").on(table.id, table.userId),
  ],
);

export const memoryRecordVersions = decivexa.table(
  "memory_record_versions",
  {
    id: text("id").primaryKey(),
    recordId: text("record_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    provenance: text("provenance").$type<MemoryProvenance>().notNull(),
    lifecycle: text("lifecycle")
      .$type<MemoryLifecycleState>()
      .notNull()
      .default("active"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull(),
    confidence: real("confidence"),
    // Unified content/reference value slot (Founder-approved Model C /
    // Decision B - unified, not split). Nullable: a version may carry no
    // value at all, matching every pre-increment record. `valueKind`
    // governs interpretation; no reference-target typing is implied.
    valueKind: text("value_kind").$type<MemoryValueKind>(),
    value: text("value"),
    // Independent user-confirmation dimension (Decision D.2), distinct
    // from provenance/lifecycle/confidence and never derived from them.
    // Defaults false; no confirmation workflow sets this true in this
    // increment (deferred) - preserves TD-06's anti-poisoning invariant.
    userConfirmed: boolean("user_confirmed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("memory_record_versions_record_id_version_unique").on(
      table.recordId,
      table.version,
    ),
    foreignKey({
      columns: [table.recordId, table.userId],
      foreignColumns: [memoryRecords.id, memoryRecords.userId],
      name: "memory_record_versions_record_owner_fk",
    }).onDelete("restrict"),
    check("memory_record_versions_version_check", sql`${table.version} >= 1`),
    check(
      "memory_record_versions_provenance_check",
      sql`${table.provenance} in ('declared','observed')`,
    ),
    check(
      "memory_record_versions_lifecycle_check",
      sql`${table.lifecycle} in ('active','corrected','deleted')`,
    ),
    check(
      "memory_record_versions_value_kind_check",
      sql`${table.valueKind} is null or ${table.valueKind} in ('content','reference')`,
    ),
  ],
);

export type MemoryRecordRow = typeof memoryRecords.$inferSelect;
export type NewMemoryRecordRow = typeof memoryRecords.$inferInsert;
export type MemoryRecordVersionRow = typeof memoryRecordVersions.$inferSelect;
export type NewMemoryRecordVersionRow = typeof memoryRecordVersions.$inferInsert;
