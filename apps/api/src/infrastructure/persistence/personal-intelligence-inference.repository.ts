import { and, asc, eq, gt, inArray, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceInferences,
  personalIntelligenceInferenceEvidenceReferences,
  personalIntelligenceInferenceClaimContext,
  personalIntelligenceInferenceLifecycleEvents,
} from "../../persistence/schema/personal-intelligence-inference.schema";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
import { personalIntelligenceClaims } from "../../persistence/schema/personal-intelligence.schema";
import type {
  PersonalIntelligenceClaimType,
  PersonalIntelligenceValueKind,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type {
  PersonalIntelligenceInference,
  PersonalIntelligenceInferenceLifecycleEvent,
  PersonalIntelligenceInferenceStatus,
} from "../../core/personal-intelligence/personal-intelligence-inference.model";
import type {
  CreateInferenceInput,
  PersonalIntelligenceInferenceRepository,
  TransitionInferenceLifecycleInput,
} from "../../core/personal-intelligence/personal-intelligence-inference.repository";

function toDomainInference(
  row: typeof personalIntelligenceInferences.$inferSelect,
): PersonalIntelligenceInference {
  return {
    id: row.id,
    userId: row.userId,
    claimType: row.claimType as PersonalIntelligenceClaimType,
    valueKind: row.valueKind as PersonalIntelligenceValueKind,
    valueText: row.valueText,
    generatedAt: row.generatedAt,
    createdAt: row.createdAt,
    producerCapabilityId: row.producerCapabilityId,
    producerCapabilityVersion: row.producerCapabilityVersion,
    producerProviderId: row.producerProviderId,
    producerModelId: row.producerModelId,
    modelReportedConfidence: row.modelReportedConfidence,
    systemAdjustedConfidence: row.systemAdjustedConfidence,
  };
}

function toDomainLifecycleEvent(
  row: typeof personalIntelligenceInferenceLifecycleEvents.$inferSelect,
): PersonalIntelligenceInferenceLifecycleEvent {
  return {
    id: row.id,
    inferenceId: row.inferenceId,
    userId: row.userId,
    sequence: row.sequence,
    fromStatus: row.fromStatus as PersonalIntelligenceInferenceStatus | null,
    toStatus: row.toStatus as PersonalIntelligenceInferenceStatus,
    transitionedAt: row.transitionedAt,
    createdAt: row.createdAt,
  };
}

// Aliased handle for the correlated NOT EXISTS "no newer lifecycle event
// exists" guard inside transitionLifecycle - mirrors the identical
// newerClaimVersion/newerVersion aliasing already proven in
// DrizzlePersonalIntelligenceClaimRepository.appendCorrection and
// DrizzleEvidenceRepository.appendLifecycleVersion.
const newerLifecycleEvent = alias(
  personalIntelligenceInferenceLifecycleEvents,
  "newer_lifecycle_event",
);

// Dedupe while preserving nothing order-dependent - only used to compute
// an expected count for the "did every supplied reference resolve"
// check below.
function distinct(ids: readonly string[]): string[] {
  return Array.from(new Set(ids));
}

export class DrizzlePersonalIntelligenceInferenceRepository
  implements PersonalIntelligenceInferenceRepository
{
  constructor(private readonly db: DatabaseClient) {}

  // Creation is one atomic unit (Contract §I): the inference row, its
  // mandatory evidence references, its optional claim-context references,
  // and the initial `proposed` lifecycle-history entry are all inserted
  // inside a single transaction, or none of them are.
  //
  // Multi-row reference validation (evidence, claim-context) cannot use
  // the single-statement INSERT...SELECT...WHERE ownership-check pattern
  // this codebase uses for a *single* optional FK (create()'s
  // evidenceVersionId branch), because that pattern only proves "this one
  // reference belongs to the user" - it cannot express "every one of N
  // supplied references belongs to the user, and there are at least N of
  // them" as a single WHERE precondition. Instead: insert via
  // INSERT...SELECT sourced from the owning table filtered to
  // (id IN (...supplied), userId = ?), then compare the resulting
  // inserted-row count against the deduplicated supplied-id count. Any
  // mismatch - a nonexistent id, a cross-user id, or (implicitly) zero
  // supplied ids - throws, which rolls back the entire transaction,
  // including the inference row already inserted. This is the minimal,
  // precedent-consistent generalization of the existing single-reference
  // ownership-check technique to a mandatory-minimum-count, multi-row
  // case.
  async create(input: CreateInferenceInput): Promise<PersonalIntelligenceInference> {
    return this.db.transaction(async (tx) => {
      const [inferenceRow] = await tx
        .insert(personalIntelligenceInferences)
        .values({
          id: input.inferenceId,
          userId: input.userId,
          claimType: input.claimType,
          valueKind: input.valueKind,
          valueText: input.valueText,
          generatedAt: input.generatedAt,
          createdAt: input.now,
          producerCapabilityId: input.producerCapabilityId,
          producerCapabilityVersion: input.producerCapabilityVersion,
          producerProviderId: input.producerProviderId,
          producerModelId: input.producerModelId,
          modelReportedConfidence: input.modelReportedConfidence,
          systemAdjustedConfidence: input.systemAdjustedConfidence,
        })
        .returning();

      if (!inferenceRow) throw new Error("Failed to create personal intelligence inference");

      // Invariant 4: reject before persistence if zero evidence
      // references were supplied - a ClaimVersion-only-grounded inference
      // must never be created (Contract §G).
      const evidenceIds = distinct(input.evidenceVersionIds);
      if (evidenceIds.length === 0) {
        throw new Error(
          "Cannot create personal intelligence inference: at least one direct EvidenceVersion reference is required (Invariant 4)",
        );
      }

      const insertedEvidenceRefs = await tx
        .insert(personalIntelligenceInferenceEvidenceReferences)
        .select((qb) =>
          qb
            .select({
              inferenceId: sql<string>`${input.inferenceId}`.as("inference_id"),
              evidenceVersionId: evidenceVersions.id,
              userId: evidenceVersions.userId,
            })
            .from(evidenceVersions)
            .where(and(inArray(evidenceVersions.id, evidenceIds), eq(evidenceVersions.userId, input.userId))),
        )
        .returning();

      if (insertedEvidenceRefs.length !== evidenceIds.length) {
        throw new Error(
          "Cannot create personal intelligence inference: one or more EvidenceVersion references do not exist or do not belong to the authenticated user",
        );
      }

      const claimContextIds = distinct(input.claimContextIds);
      if (claimContextIds.length > 0) {
        const insertedClaimContext = await tx
          .insert(personalIntelligenceInferenceClaimContext)
          .select((qb) =>
            qb
              .select({
                inferenceId: sql<string>`${input.inferenceId}`.as("inference_id"),
                claimId: personalIntelligenceClaims.id,
                userId: personalIntelligenceClaims.userId,
              })
              .from(personalIntelligenceClaims)
              .where(
                and(
                  inArray(personalIntelligenceClaims.id, claimContextIds),
                  eq(personalIntelligenceClaims.userId, input.userId),
                ),
              ),
          )
          .returning();

        if (insertedClaimContext.length !== claimContextIds.length) {
          throw new Error(
            "Cannot create personal intelligence inference: one or more ClaimVersion context references do not exist or do not belong to the authenticated user",
          );
        }
      }

      await tx.insert(personalIntelligenceInferenceLifecycleEvents).values({
        id: input.initialLifecycleEventId,
        inferenceId: input.inferenceId,
        userId: input.userId,
        sequence: 1,
        fromStatus: null,
        toStatus: "proposed",
        transitionedAt: input.now,
        createdAt: input.now,
      });

      return toDomainInference(inferenceRow);
    });
  }

  async findInferenceForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInference | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceInferences)
      .where(
        and(eq(personalIntelligenceInferences.id, inferenceId), eq(personalIntelligenceInferences.userId, userId)),
      )
      .limit(1);

    return row ? toDomainInference(row) : null;
  }

  async findEvidenceReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    const rows = await this.db
      .select({ evidenceVersionId: personalIntelligenceInferenceEvidenceReferences.evidenceVersionId })
      .from(personalIntelligenceInferenceEvidenceReferences)
      .where(
        and(
          eq(personalIntelligenceInferenceEvidenceReferences.inferenceId, inferenceId),
          eq(personalIntelligenceInferenceEvidenceReferences.userId, userId),
        ),
      );

    return rows.map((row) => row.evidenceVersionId);
  }

  async findClaimContextReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    const rows = await this.db
      .select({ claimId: personalIntelligenceInferenceClaimContext.claimId })
      .from(personalIntelligenceInferenceClaimContext)
      .where(
        and(
          eq(personalIntelligenceInferenceClaimContext.inferenceId, inferenceId),
          eq(personalIntelligenceInferenceClaimContext.userId, userId),
        ),
      );

    return rows.map((row) => row.claimId);
  }

  async findLifecycleHistoryForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceInferenceLifecycleEvents)
      .where(
        and(
          eq(personalIntelligenceInferenceLifecycleEvents.inferenceId, inferenceId),
          eq(personalIntelligenceInferenceLifecycleEvents.userId, userId),
        ),
      )
      .orderBy(asc(personalIntelligenceInferenceLifecycleEvents.sequence));

    return rows.map(toDomainLifecycleEvent);
  }

  // Appends exactly one new lifecycle-history entry, atomically, via the
  // same single-statement INSERT...SELECT...WHERE + correlated NOT EXISTS
  // concurrency guard already proven by
  // DrizzlePersonalIntelligenceClaimRepository.appendCorrection and
  // DrizzleEvidenceRepository.appendLifecycleVersion:
  //   - the SELECT only produces a source row when a lifecycle-history
  //     row matching (inferenceId, userId, toStatus = expectedFromStatus)
  //     currently holds the greatest `sequence` for that inference;
  //   - the correlated NOT EXISTS additionally refuses to append when a
  //     lifecycle-history row with a greater `sequence` already exists,
  //     so a stale expectedFromStatus (a concurrent transition already
  //     happened) is rejected outright rather than silently
  //     reinterpreted;
  //   - the unique(inferenceId, sequence) constraint is the final,
  //     database-enforced backstop against a race between two concurrent
  //     transitionLifecycle calls.
  // The fixed transition graph (Contract §F: every non-initial transition
  // originates from "proposed") is enforced up front, without a DB round
  // trip, by refusing any expectedFromStatus other than "proposed" -
  // there is no persisted lifecycle-history row this codebase ever
  // creates with toStatus other than one of the four terminal values, so
  // a caller-supplied expectedFromStatus of e.g. "confirmed" could never
  // legitimately match a *current* effective status transition target
  // under this graph, and is rejected the same way an invalid toStatus
  // would be - no lifecycle-history entry is created.
  async transitionLifecycle(
    input: TransitionInferenceLifecycleInput,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent | null> {
    if (input.expectedFromStatus !== "proposed") {
      return null;
    }

    const [row] = await this.db
      .insert(personalIntelligenceInferenceLifecycleEvents)
      .select((qb) =>
        qb
          .select({
            id: sql<string>`${input.lifecycleEventId}`.as("id"),
            inferenceId: personalIntelligenceInferenceLifecycleEvents.inferenceId,
            userId: personalIntelligenceInferenceLifecycleEvents.userId,
            sequence: sql<number>`${personalIntelligenceInferenceLifecycleEvents.sequence} + 1`.as("sequence"),
            fromStatus: sql<string>`${personalIntelligenceInferenceLifecycleEvents.toStatus}`.as("from_status"),
            toStatus: sql<string>`${input.toStatus}`.as("to_status"),
            transitionedAt: sql<Date>`${input.transitionedAt}`.as("transitioned_at"),
            createdAt: sql<Date>`${input.now}`.as("created_at"),
          })
          .from(personalIntelligenceInferenceLifecycleEvents)
          .where(
            and(
              eq(personalIntelligenceInferenceLifecycleEvents.inferenceId, input.inferenceId),
              eq(personalIntelligenceInferenceLifecycleEvents.userId, input.userId),
              eq(personalIntelligenceInferenceLifecycleEvents.toStatus, input.expectedFromStatus),
              notExists(
                qb
                  .select({ one: sql`1` })
                  .from(newerLifecycleEvent)
                  .where(
                    and(
                      eq(newerLifecycleEvent.inferenceId, input.inferenceId),
                      gt(newerLifecycleEvent.sequence, personalIntelligenceInferenceLifecycleEvents.sequence),
                    ),
                  ),
              ),
            ),
          ),
      )
      .returning();

    return row ? toDomainLifecycleEvent(row) : null;
  }
}
