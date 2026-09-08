import { and, asc, eq, gt, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceEvaluationStandards,
  personalIntelligenceEvaluationStandardVersions,
} from "../../persistence/schema/personal-intelligence-evaluation.schema";
import type {
  PersonalIntelligenceEvaluationStandard,
  PersonalIntelligenceEvaluationStandardVersion,
} from "../../core/personal-intelligence/personal-intelligence-evaluation-standard.model";
import type {
  CreateEvaluationStandardInput,
  CreateEvaluationStandardVersionInput,
  PersonalIntelligenceEvaluationStandardRepository,
} from "../../core/personal-intelligence/personal-intelligence-evaluation-standard.repository";

function toDomainStandard(
  row: typeof personalIntelligenceEvaluationStandards.$inferSelect,
): PersonalIntelligenceEvaluationStandard {
  return { id: row.id, userId: row.userId, createdAt: row.createdAt };
}

function toDomainVersion(
  row: typeof personalIntelligenceEvaluationStandardVersions.$inferSelect,
): PersonalIntelligenceEvaluationStandardVersion {
  return {
    id: row.id,
    standardId: row.standardId,
    userId: row.userId,
    version: row.version,
    criteria: row.criteria,
    createdAt: row.createdAt,
  };
}

// Mirrors DrizzleEvidenceRepository's own hasUniqueViolationCode/
// isUniqueViolation pair exactly - PostgreSQL's unique-violation error
// (code "23505") may arrive either as the raw pg error or wrapped in
// Drizzle's DrizzleQueryError (where the code lives at error.cause).
function hasUniqueViolationCode(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    (value as { code?: unknown }).code === "23505"
  );
}

function isUniqueViolation(error: unknown): boolean {
  if (hasUniqueViolationCode(error)) return true;
  const cause =
    typeof error === "object" && error !== null && "cause" in error
      ? (error as { cause?: unknown }).cause
      : undefined;
  return hasUniqueViolationCode(cause);
}

// Aliased handle used only inside the correlated NOT EXISTS subquery
// below, so it reads as a distinct range table from the outer reference
// in the same statement - mirrors the identical
// newerVersion/newerLifecycleEvent aliasing already proven in
// DrizzleEvidenceRepository.appendLifecycleVersion and
// DrizzlePersonalIntelligenceInferenceRepository.transitionLifecycle.
const newerStandardVersion = alias(
  personalIntelligenceEvaluationStandardVersions,
  "newer_standard_version",
);

export class DrizzlePersonalIntelligenceEvaluationStandardRepository
  implements PersonalIntelligenceEvaluationStandardRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Identity row and its first version are inserted inside a single
  // transaction, mirroring the Evidence/create() and
  // PersonalIntelligenceInference/create() precedent (an identity row
  // and its initial dependent row are one atomic unit, or neither is
  // persisted).
  async create(
    input: CreateEvaluationStandardInput,
  ): Promise<PersonalIntelligenceEvaluationStandard> {
    return this.db.transaction(async (tx) => {
      const [standardRow] = await tx
        .insert(personalIntelligenceEvaluationStandards)
        .values({ id: input.standardId, userId: input.userId, createdAt: input.now })
        .returning();

      if (!standardRow) throw new Error("Failed to create personal intelligence evaluation standard");

      await tx.insert(personalIntelligenceEvaluationStandardVersions).values({
        id: input.initialVersionId,
        standardId: input.standardId,
        userId: input.userId,
        version: 1,
        criteria: input.criteria,
        createdAt: input.now,
      });

      return toDomainStandard(standardRow);
    });
  }

  async findStandardForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandard | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceEvaluationStandards)
      .where(
        and(
          eq(personalIntelligenceEvaluationStandards.id, standardId),
          eq(personalIntelligenceEvaluationStandards.userId, userId),
        ),
      )
      .limit(1);

    return row ? toDomainStandard(row) : null;
  }

  // Appends a new, immutable version via the same single-statement
  // INSERT...SELECT...WHERE + correlated NOT EXISTS concurrency guard
  // already proven by DrizzleEvidenceRepository.appendLifecycleVersion:
  //   - the SELECT only produces a source row when a version row
  //     matching (standardId, userId, version = expectedVersion)
  //     currently exists;
  //   - the correlated NOT EXISTS additionally refuses to append when a
  //     version newer than expectedVersion already exists, so a stale
  //     expectedVersion is rejected outright rather than silently
  //     reinterpreted as "append after the true latest";
  //   - the existing unique(standardId, version) constraint is the
  //     final, database-enforced backstop against a race between two
  //     concurrent createVersion calls, caught below exactly as
  //     appendLifecycleVersion catches it.
  // Returns null — never an error — when the Standard/expected-version
  // does not resolve, mirroring the established ownership/concurrency
  // discipline used throughout this codebase's other append-style
  // operations.
  async createVersion(
    input: CreateEvaluationStandardVersionInput,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceEvaluationStandardVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              standardId: personalIntelligenceEvaluationStandardVersions.standardId,
              userId: personalIntelligenceEvaluationStandardVersions.userId,
              version: sql<number>`${personalIntelligenceEvaluationStandardVersions.version} + 1`.as(
                "version",
              ),
              criteria: sql<string>`${input.criteria}`.as("criteria"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceEvaluationStandardVersions)
            .where(
              and(
                eq(personalIntelligenceEvaluationStandardVersions.standardId, input.standardId),
                eq(personalIntelligenceEvaluationStandardVersions.userId, input.userId),
                eq(personalIntelligenceEvaluationStandardVersions.version, input.expectedVersion),
                notExists(
                  qb
                    .select({ one: sql`1` })
                    .from(newerStandardVersion)
                    .where(
                      and(
                        eq(newerStandardVersion.standardId, input.standardId),
                        gt(newerStandardVersion.version, input.expectedVersion),
                      ),
                    ),
                ),
              ),
            ),
        )
        .returning();

      return row ? toDomainVersion(row) : null;
    } catch (error) {
      if (isUniqueViolation(error)) return null;
      throw error;
    }
  }

  async findVersionForUser(
    userId: string,
    versionId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceEvaluationStandardVersions)
      .where(
        and(
          eq(personalIntelligenceEvaluationStandardVersions.id, versionId),
          eq(personalIntelligenceEvaluationStandardVersions.userId, userId),
        ),
      )
      .limit(1);

    return row ? toDomainVersion(row) : null;
  }

  async findVersionHistoryForUser(
    userId: string,
    standardId: string,
  ): Promise<PersonalIntelligenceEvaluationStandardVersion[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceEvaluationStandardVersions)
      .where(
        and(
          eq(personalIntelligenceEvaluationStandardVersions.standardId, standardId),
          eq(personalIntelligenceEvaluationStandardVersions.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceEvaluationStandardVersions.version));

    return rows.map(toDomainVersion);
  }
}
