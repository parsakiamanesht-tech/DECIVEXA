import { and, asc, eq, exists, gt, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
} from "../../persistence/schema/personal-intelligence.schema";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
// D3 Inference -> Claim Promotion Write Path (Implementation Increment
// Contract, docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-*).
// Safe to import directly: personal-intelligence-inference.schema.ts
// deliberately does not import from personal-intelligence.schema.ts (see
// that file's own header comment), so no circular module dependency is
// introduced by importing it here, in the infrastructure layer, exactly
// mirroring how evidenceVersions above is already imported directly
// rather than via a separate repository.
import { personalIntelligenceInferences } from "../../persistence/schema/personal-intelligence-inference.schema";
import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceEvidenceLinkageState,
  PersonalIntelligenceProvenance,
  PersonalIntelligenceValueKind,
  PersonalIntelligenceLifecycle,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
  PersonalIntelligenceClaimRepository,
} from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type { EvidenceLifecycle, EvidenceProvenance, EvidenceVersion } from "../../core/evidence/evidence.model";

function toDomainClaim(
  row: typeof personalIntelligenceClaims.$inferSelect,
): PersonalIntelligenceClaim {
  return {
    id: row.id,
    userId: row.userId,
    claimType: row.claimType as PersonalIntelligenceClaimType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toDomainVersion(
  row: typeof personalIntelligenceClaimVersions.$inferSelect,
): PersonalIntelligenceClaimVersion {
  return {
    id: row.id,
    claimId: row.claimId,
    version: row.version,
    userId: row.userId,
    valueKind: row.valueKind as PersonalIntelligenceValueKind,
    valueText: row.valueText,
    provenance: row.provenance as PersonalIntelligenceProvenance,
    confidence: row.confidence,
    lifecycle: row.lifecycle as PersonalIntelligenceLifecycle,
    evidenceVersionId: row.evidenceVersionId,
    // D3 Inference -> Claim Promotion Write Path (Implementation
    // Increment Contract, docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-*).
    // Set by create()/appendCorrection() when the caller supplies a
    // valid, owned inferenceId; null otherwise.
    inferenceId: row.inferenceId,
    evidenceLinkageState: row.evidenceLinkageState as PersonalIntelligenceEvidenceLinkageState,
    // Temporal Validity axis (Implementation Increment Contract,
    // docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md).
    // Set only from explicit caller input on create()/appendCorrection();
    // null means "not established," never "always"/"now".
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
    // Claim-level Context (Implementation Increment Contract,
    // docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md).
    // Set only from explicit caller input on create()/appendCorrection();
    // null means "not established," never "always"/"now".
    situationSetting: row.situationSetting,
    timeOfDay: row.timeOfDay,
    observedAt: row.observedAt,
    acceptedAt: row.acceptedAt,
    createdAt: row.createdAt,
  };
}

function toDomainEvidenceVersion(
  row: typeof evidenceVersions.$inferSelect,
): EvidenceVersion {
  return {
    id: row.id,
    evidenceId: row.evidenceId,
    version: row.version,
    userId: row.userId,
    provenance: row.provenance as EvidenceProvenance,
    lifecycle: row.lifecycle as EvidenceLifecycle,
    observedAt: row.observedAt,
    acceptedAt: row.acceptedAt,
    confidence: row.confidence,
    createdAt: row.createdAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

// Aliased handle onto personal_intelligence_claim_versions used only inside
// the correlated NOT EXISTS subquery in appendCorrection, so it reads as a
// distinct range table from the outer reference in the same statement -
// mirrors the exact "newer version" guard already proven in
// DrizzleEvidenceRepository.appendLifecycleVersion.
const newerClaimVersion = alias(personalIntelligenceClaimVersions, "newer_claim_version");

export class DrizzlePersonalIntelligenceClaimRepository
  implements PersonalIntelligenceClaimRepository
{
  constructor(private readonly db: DatabaseClient) {}

  async findClaimForUser(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaim | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceClaims)
      .where(
        and(
          eq(personalIntelligenceClaims.id, claimId),
          eq(personalIntelligenceClaims.userId, userId),
        ),
      )
      .limit(1);

    return row ? toDomainClaim(row) : null;
  }

  async findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceClaimVersions)
      .where(
        and(
          eq(personalIntelligenceClaimVersions.claimId, claimId),
          eq(personalIntelligenceClaimVersions.userId, userId),
          eq(personalIntelligenceClaimVersions.version, version),
        ),
      )
      .limit(1);

    return row ? toDomainVersion(row) : null;
  }

  // Returns every currently active version for the user, optionally scoped
  // to a claimType - deliberately unfiltered otherwise: multiple active
  // versions of the same claimType are legal and must remain jointly
  // observable so a future consumer can see contradictions, never a single
  // "resolved" claim. claimType lives on the parent claim identity row, not
  // on the version row itself, hence the join.
  async findActiveClaimVersionsForUser(
    userId: string,
    claimType?: PersonalIntelligenceClaimType,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    const rows = await this.db
      .select({
        id: personalIntelligenceClaimVersions.id,
        claimId: personalIntelligenceClaimVersions.claimId,
        version: personalIntelligenceClaimVersions.version,
        userId: personalIntelligenceClaimVersions.userId,
        valueKind: personalIntelligenceClaimVersions.valueKind,
        valueText: personalIntelligenceClaimVersions.valueText,
        provenance: personalIntelligenceClaimVersions.provenance,
        confidence: personalIntelligenceClaimVersions.confidence,
        lifecycle: personalIntelligenceClaimVersions.lifecycle,
        evidenceVersionId: personalIntelligenceClaimVersions.evidenceVersionId,
        inferenceId: personalIntelligenceClaimVersions.inferenceId,
        evidenceLinkageState: personalIntelligenceClaimVersions.evidenceLinkageState,
        effectiveFrom: personalIntelligenceClaimVersions.effectiveFrom,
        effectiveTo: personalIntelligenceClaimVersions.effectiveTo,
        situationSetting: personalIntelligenceClaimVersions.situationSetting,
        timeOfDay: personalIntelligenceClaimVersions.timeOfDay,
        observedAt: personalIntelligenceClaimVersions.observedAt,
        acceptedAt: personalIntelligenceClaimVersions.acceptedAt,
        createdAt: personalIntelligenceClaimVersions.createdAt,
      })
      .from(personalIntelligenceClaimVersions)
      .innerJoin(
        personalIntelligenceClaims,
        eq(personalIntelligenceClaimVersions.claimId, personalIntelligenceClaims.id),
      )
      .where(
        and(
          eq(personalIntelligenceClaimVersions.userId, userId),
          eq(personalIntelligenceClaimVersions.lifecycle, "active"),
          claimType ? eq(personalIntelligenceClaims.claimType, claimType) : undefined,
        ),
      )
      .orderBy(asc(personalIntelligenceClaimVersions.createdAt));

    return rows.map(toDomainVersion);
  }

  // Creates the stable claim identity row plus its version 1 row, atomically.
  // Ownership of an optional evidenceVersionId and/or inferenceId (D3
  // Inference -> Claim Promotion Write Path) is verified atomically via the
  // same INSERT ... SELECT ... WHERE technique already proven in
  // DrizzlePersonalStateRepository.insertRevision - a mismatched/nonexistent
  // reference yields zero source rows, so nothing is inserted and the whole
  // transaction (including the claim identity row already inserted) rolls
  // back. Four cases:
  //   - neither reference supplied: plain, unconditional insert (no
  //     ownership fact to verify).
  //   - only evidenceVersionId supplied: sourced FROM evidence_versions
  //     (unchanged from before this revision).
  //   - only inferenceId supplied: sourced FROM
  //     personal_intelligence_inferences instead, mirroring the
  //     evidenceVersionId branch exactly.
  //   - both supplied: sourced FROM evidence_versions (as with
  //     evidence-only), with an additional correlated EXISTS against
  //     personal_intelligence_inferences layered on - the same
  //     "base source plus optional EXISTS" technique already used by
  //     appendCorrection below.
  // Referencing an Inference is a provenance/causal-linkage pointer only
  // (Contract §6/§5.F): it is not gated by the Inference's lifecycle
  // status, never mutates the Inference, and never appends an Inference
  // lifecycle-history entry.
  async create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion> {
    return this.db.transaction(async (tx) => {
      await tx.insert(personalIntelligenceClaims).values({
        id: input.claimId,
        userId: input.userId,
        claimType: input.claimType,
        createdAt: input.now,
        updatedAt: input.now,
      });

      if (input.evidenceVersionId === null && input.inferenceId === null) {
        const [row] = await tx
          .insert(personalIntelligenceClaimVersions)
          .values({
            id: input.versionId,
            claimId: input.claimId,
            userId: input.userId,
            version: 1,
            valueKind: input.valueKind,
            valueText: input.valueText,
            provenance: input.provenance,
            confidence: input.confidence,
            lifecycle: "active",
            evidenceVersionId: null,
            inferenceId: null,
            evidenceLinkageState: input.evidenceLinkageState,
            effectiveFrom: input.effectiveFrom,
            effectiveTo: input.effectiveTo,
            situationSetting: input.situationSetting,
            timeOfDay: input.timeOfDay,
            observedAt: input.observedAt,
            acceptedAt: input.acceptedAt,
            createdAt: input.now,
          })
          .returning();

        if (!row) throw new Error("Failed to create personal intelligence claim");
        return toDomainVersion(row);
      }

      if (input.evidenceVersionId === null) {
        // Narrowed: inferenceId is non-null here (the both-null case
        // returned above).
        const inferenceId = input.inferenceId as string;

        const [row] = await tx
          .insert(personalIntelligenceClaimVersions)
          .select((qb) =>
            qb
              .select({
                id: sql<string>`${input.versionId}`.as("id"),
                claimId: sql<string>`${input.claimId}`.as("claim_id"),
                userId: personalIntelligenceInferences.userId,
                version: sql<number>`1`.as("version"),
                valueKind: sql<string>`${input.valueKind}`.as("value_kind"),
                valueText: sql<string>`${input.valueText}`.as("value_text"),
                provenance: sql<string>`${input.provenance}`.as("provenance"),
                confidence: sql<number>`${input.confidence}`.as("confidence"),
                lifecycle: sql<string>`active`.as("lifecycle"),
                evidenceVersionId: sql<string | null>`null`.as("evidence_version_id"),
                inferenceId: personalIntelligenceInferences.id,
                evidenceLinkageState: sql<string>`${input.evidenceLinkageState}`.as("evidence_linkage_state"),
                effectiveFrom: sql<Date | null>`${input.effectiveFrom}`.as("effective_from"),
                effectiveTo: sql<Date | null>`${input.effectiveTo}`.as("effective_to"),
                situationSetting: sql<string | null>`${input.situationSetting}`.as("situation_setting"),
                timeOfDay: sql<string | null>`${input.timeOfDay}`.as("time_of_day"),
                observedAt: sql<Date>`${input.observedAt}`.as("observed_at"),
                acceptedAt: sql<Date>`${input.acceptedAt}`.as("accepted_at"),
                createdAt: sql<Date>`${input.now}`.as("created_at"),
              })
              .from(personalIntelligenceInferences)
              .where(
                and(
                  eq(personalIntelligenceInferences.id, inferenceId),
                  eq(personalIntelligenceInferences.userId, input.userId),
                ),
              ),
          )
          .returning();

        if (!row) {
          throw new Error(
            "Cannot create personal intelligence claim: the referenced Inference does not belong to the authenticated user",
          );
        }

        return toDomainVersion(row);
      }

      // Extracted to a local so TypeScript's null-narrowing (established by
      // the branches above) survives capture inside the nested query
      // builder closure below - narrowing a property access on `input`
      // itself does not persist across a closure boundary.
      const evidenceVersionId = input.evidenceVersionId;
      const inferenceId = input.inferenceId;

      const [row] = await tx
        .insert(personalIntelligenceClaimVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              claimId: sql<string>`${input.claimId}`.as("claim_id"),
              userId: evidenceVersions.userId,
              version: sql<number>`1`.as("version"),
              valueKind: sql<string>`${input.valueKind}`.as("value_kind"),
              valueText: sql<string>`${input.valueText}`.as("value_text"),
              provenance: sql<string>`${input.provenance}`.as("provenance"),
              confidence: sql<number>`${input.confidence}`.as("confidence"),
              lifecycle: sql<string>`active`.as("lifecycle"),
              evidenceVersionId: evidenceVersions.id,
              inferenceId: sql<string | null>`${inferenceId}`.as("inference_id"),
              evidenceLinkageState: sql<string>`${input.evidenceLinkageState}`.as("evidence_linkage_state"),
              effectiveFrom: sql<Date | null>`${input.effectiveFrom}`.as("effective_from"),
              effectiveTo: sql<Date | null>`${input.effectiveTo}`.as("effective_to"),
              situationSetting: sql<string | null>`${input.situationSetting}`.as("situation_setting"),
              timeOfDay: sql<string | null>`${input.timeOfDay}`.as("time_of_day"),
              observedAt: sql<Date>`${input.observedAt}`.as("observed_at"),
              acceptedAt: sql<Date>`${input.acceptedAt}`.as("accepted_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(evidenceVersions)
            .where(
              and(
                eq(evidenceVersions.id, evidenceVersionId),
                eq(evidenceVersions.userId, input.userId),
                inferenceId
                  ? exists(
                      qb
                        .select({ one: sql`1` })
                        .from(personalIntelligenceInferences)
                        .where(
                          and(
                            eq(personalIntelligenceInferences.id, inferenceId),
                            eq(personalIntelligenceInferences.userId, input.userId),
                          ),
                        ),
                    )
                  : undefined,
              ),
            ),
        )
        .returning();

      if (!row) {
        throw new Error(
          "Cannot create personal intelligence claim: the referenced EvidenceVersion or Inference does not belong to the authenticated user",
        );
      }

      return toDomainVersion(row);
    });
  }

  // Appends exactly one new immutable version to an existing claim. Never
  // UPDATEs or DELETEs the previous version - the relationship between
  // versions is claimId + strictly increasing version, nothing else.
  //
  // Concurrency and ownership are both enforced by a single atomic
  // INSERT ... SELECT ... WHERE, mirroring DrizzleEvidenceRepository's
  // appendLifecycleVersion pattern:
  //   - the SELECT only produces a row when a version matching
  //     (claimId, userId, version = expectedVersion) currently exists;
  //   - the correlated NOT EXISTS additionally refuses to append when a
  //     version newer than expectedVersion already exists for this claim,
  //     so a stale expectedVersion is rejected outright rather than
  //     silently reinterpreted;
  //   - when evidenceVersionId is supplied, an additional correlated EXISTS
  //     against evidence_versions requires it to belong to the same user -
  //     the same ownership fact enforced in create(), expressed as an
  //     additional WHERE condition in the same atomic statement;
  //   - likewise, when inferenceId is supplied (D3 Inference -> Claim
  //     Promotion Write Path), an additional correlated EXISTS against
  //     personal_intelligence_inferences requires it to belong to the same
  //     user - not gated by the Inference's lifecycle status (Contract
  //     §5.F);
  //   - inferenceId is always taken fresh from this input, never inherited
  //     from the prior version (Contract §5.G/§8) - a caller who wants the
  //     correction to remain associated with the same Inference must pass
  //     it again explicitly;
  //   - the existing unique(claimId, version) constraint is the final,
  //     database-enforced backstop against a race between two concurrent
  //     appendCorrection calls for the same expectedVersion.
  async appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceClaimVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              claimId: personalIntelligenceClaimVersions.claimId,
              userId: personalIntelligenceClaimVersions.userId,
              version: sql<number>`${personalIntelligenceClaimVersions.version} + 1`.as("version"),
              valueKind: sql<string>`${input.valueKind}`.as("value_kind"),
              valueText: sql<string>`${input.valueText}`.as("value_text"),
              provenance: sql<string>`${input.provenance}`.as("provenance"),
              confidence: sql<number>`${input.confidence}`.as("confidence"),
              lifecycle: sql<string>`${input.lifecycle}`.as("lifecycle"),
              evidenceVersionId: sql<string | null>`${input.evidenceVersionId}`.as(
                "evidence_version_id",
              ),
              // D3 Inference -> Claim Promotion Write Path: always taken
              // fresh from this input, never inherited from the prior
              // version (Contract §5.G/§8) - see the ownership EXISTS
              // check below for the corresponding validation.
              inferenceId: sql<string | null>`${input.inferenceId}`.as("inference_id"),
              evidenceLinkageState: sql<string>`${input.evidenceLinkageState}`.as("evidence_linkage_state"),
              // Temporal Validity axis: always taken fresh from this
              // input, exactly like inferenceId above - NEVER sourced from
              // personalIntelligenceClaimVersions.effectiveFrom/.effectiveTo
              // of the matched prior row (Option A - Always Explicit,
              // Founder-approved, Contract §6). This makes inheritance
              // structurally impossible: there is no reference anywhere in
              // this projection to the prior row's temporal columns.
              effectiveFrom: sql<Date | null>`${input.effectiveFrom}`.as("effective_from"),
              effectiveTo: sql<Date | null>`${input.effectiveTo}`.as("effective_to"),
              // Claim-level Context: always taken fresh from this input,
              // exactly like effectiveFrom/effectiveTo and inferenceId
              // above - NEVER sourced from personalIntelligenceClaimVersions
              // .situationSetting/.timeOfDay of the matched prior row
              // (Always Explicit, Contract §12). No reference anywhere in
              // this projection to the prior row's Context columns.
              situationSetting: sql<string | null>`${input.situationSetting}`.as("situation_setting"),
              timeOfDay: sql<string | null>`${input.timeOfDay}`.as("time_of_day"),
              observedAt: sql<Date>`${input.observedAt}`.as("observed_at"),
              acceptedAt: sql<Date>`${input.acceptedAt}`.as("accepted_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceClaimVersions)
            .where(
              and(
                eq(personalIntelligenceClaimVersions.claimId, input.claimId),
                eq(personalIntelligenceClaimVersions.userId, input.userId),
                eq(personalIntelligenceClaimVersions.version, input.expectedVersion),
                notExists(
                  qb
                    .select({ one: sql`1` })
                    .from(newerClaimVersion)
                    .where(
                      and(
                        eq(newerClaimVersion.claimId, input.claimId),
                        gt(newerClaimVersion.version, input.expectedVersion),
                      ),
                    ),
                ),
                input.evidenceVersionId
                  ? exists(
                      qb
                        .select({ one: sql`1` })
                        .from(evidenceVersions)
                        .where(
                          and(
                            eq(evidenceVersions.id, input.evidenceVersionId),
                            eq(evidenceVersions.userId, input.userId),
                          ),
                        ),
                    )
                  : undefined,
                input.inferenceId
                  ? exists(
                      qb
                        .select({ one: sql`1` })
                        .from(personalIntelligenceInferences)
                        .where(
                          and(
                            eq(personalIntelligenceInferences.id, input.inferenceId),
                            eq(personalIntelligenceInferences.userId, input.userId),
                          ),
                        ),
                    )
                  : undefined,
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

  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01
  // (docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md).
  // Returns every version row for this user - deliberately no lifecycle
  // filter, unlike findActiveClaimVersionsForUser above, so a consumer can
  // observe the full history (active, superseded, corrected, revoked,
  // disputed), not only the current state. `since`, when supplied,
  // excludes the reference row itself (strict greater-than) so repeated
  // polling with the last-seen createdAt never re-returns it.
  async findVersionsForUser(
    userId: string,
    since?: Date,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceClaimVersions)
      .where(
        and(
          eq(personalIntelligenceClaimVersions.userId, userId),
          since ? gt(personalIntelligenceClaimVersions.createdAt, since) : undefined,
        ),
      )
      .orderBy(asc(personalIntelligenceClaimVersions.createdAt));

    return rows.map(toDomainVersion);
  }

  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01. Resolves an
  // EvidenceVersion by its own id, scoped to the requesting user - the
  // same ownership fact already enforced inline in create() and
  // appendCorrection() above, exposed here as its own read for
  // inspectEvidence. Never writes to evidence_versions.
  async findEvidenceVersionForUser(
    userId: string,
    evidenceVersionId: string,
  ): Promise<EvidenceVersion | null> {
    const [row] = await this.db
      .select()
      .from(evidenceVersions)
      .where(and(eq(evidenceVersions.id, evidenceVersionId), eq(evidenceVersions.userId, userId)))
      .limit(1);

    return row ? toDomainEvidenceVersion(row) : null;
  }
}
