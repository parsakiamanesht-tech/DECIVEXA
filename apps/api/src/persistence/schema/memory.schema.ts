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

export const MEMORY_PROVENANCE = ["declared", "observed"] as const;
export type MemoryProvenance = (typeof MEMORY_PROVENANCE)[number];

export const MEMORY_LIFECYCLE_STATES = ["active", "corrected", "deleted"] as const;
export type MemoryLifecycleState = (typeof MEMORY_LIFECYCLE_STATES)[number];

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
  ],
);

export type MemoryRecordRow = typeof memoryRecords.$inferSelect;
export type NewMemoryRecordRow = typeof memoryRecords.$inferInsert;
export type MemoryRecordVersionRow = typeof memoryRecordVersions.$inferSelect;
export type NewMemoryRecordVersionRow = typeof memoryRecordVersions.$inferInsert;
