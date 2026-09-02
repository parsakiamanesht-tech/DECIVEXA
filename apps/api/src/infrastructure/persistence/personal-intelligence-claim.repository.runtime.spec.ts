import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { eq, inArray, sql } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
} from "../../persistence/schema/personal-intelligence.schema";
import { personalIntelligenceInferences } from "../../persistence/schema/personal-intelligence-inference.schema";
import { DrizzlePersonalIntelligenceClaimRepository } from "./personal-intelligence-claim.repository";

// Q1 — Live-PostgreSQL Runtime Verification Closure (Founder Execution
// Authorization, Package Option C + CI Option B). Every assertion below
// requires a real PostgreSQL 18 connection - none of it can be proven by
// personal-intelligence-claim.repository.unique-violation.spec.ts (a stub
// DatabaseClient) or by the three *.structural.spec.ts files (static
// source-text grep, no execution at all). Exercises the actual
// DrizzlePersonalIntelligenceClaimRepository implementation unmodified;
// makes no production-behavior change.
//
// Requires process.env.DATABASE_URL, exactly the connection string already
// used by api-verification.yml's "Apply migrations"/"Start application"
// steps. No new credential, secret, or database is introduced.

if (!process.env.DATABASE_URL) {
  throw new Error(
    "personal-intelligence-claim.repository.runtime.spec.ts requires DATABASE_URL (Q1 runtime tests must run only after PostgreSQL 18 is healthy and migrated - see Founder Execution Authorization §11).",
  );
}

const { client: db, pool } = createDatabase(process.env.DATABASE_URL);
const repo = new DrizzlePersonalIntelligenceClaimRepository(db);

const runId = randomUUID();
const userAId = `q1-runtime-claim-user-a-${runId}`;
const userBId = `q1-runtime-claim-user-b-${runId}`;
const createdClaimIds: string[] = [];
const createdInferenceIds: string[] = [];

before(async () => {
  const now = new Date();
  await db.insert(users).values([
    { id: userAId, email: `${userAId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
    { id: userBId, email: `${userBId}@example.com`, passwordHash: "x", createdAt: now, updatedAt: now },
  ]);
});

after(async () => {
  if (createdClaimIds.length > 0) {
    await db.delete(personalIntelligenceClaimVersions).where(inArray(personalIntelligenceClaimVersions.claimId, createdClaimIds));
    await db.delete(personalIntelligenceClaims).where(inArray(personalIntelligenceClaims.id, createdClaimIds));
  }
  if (createdInferenceIds.length > 0) {
    await db.delete(personalIntelligenceInferences).where(inArray(personalIntelligenceInferences.id, createdInferenceIds));
  }
  await db.delete(users).where(inArray(users.id, [userAId, userBId]));
  await pool.end();
});

test("create(): referencing an Inference owned by a different user rolls back the ENTIRE transaction against real PostgreSQL - the already-inserted Claim identity row does not survive (invariant the repository's own comment documents but no existing test executes)", async () => {
  const foreignInferenceId = `q1-runtime-claim-foreign-inference-${runId}`;
  createdInferenceIds.push(foreignInferenceId);
  const now = new Date();

  // A real Inference owned by user B - not a stub, so the ownership
  // EXISTS/WHERE clause inside create()'s INSERT...SELECT branch is
  // evaluated against genuine relational data.
  await db.insert(personalIntelligenceInferences).values({
    id: foreignInferenceId,
    userId: userBId,
    claimType: "preference",
    valueKind: "text",
    valueText: "owned by user B",
    generatedAt: now,
    createdAt: now,
    producerCapabilityId: "q1-runtime-capability",
    producerCapabilityVersion: "1",
    producerProviderId: "q1-runtime-provider",
    producerModelId: "q1-runtime-model",
    modelReportedConfidence: null,
    systemAdjustedConfidence: null,
  });

  const claimId = `q1-runtime-claim-rollback-${runId}`;
  createdClaimIds.push(claimId);

  await assert.rejects(() =>
    repo.create({
      claimId,
      versionId: randomUUID(),
      userId: userAId,
      claimType: "preference",
      valueKind: "text",
      valueText: "attempted cross-user promotion",
      provenance: "declared",
      confidence: 0.7,
      evidenceVersionId: null,
      inferenceId: foreignInferenceId,
      evidenceLinkageState: "self_reported_no_evidence_required",
      effectiveFrom: null,
      effectiveTo: null,
      situationSetting: null,
      timeOfDay: null,
      observedAt: now,
      acceptedAt: now,
      now,
    }),
  );

  // The critical live-database-only proof: the Claim identity row that
  // create()'s first statement inserted, before the ownership check
  // failed, must not have survived - it can only exist if the whole
  // transaction genuinely rolled back rather than partially committing.
  const claimRow = await repo.findClaimForUser(userAId, claimId);
  assert.equal(claimRow, null, "the Claim identity row must not persist when the referenced Inference's ownership check fails - proof of real transactional atomicity");
});

test("appendCorrection: real concurrent contention on the same expectedVersion produces a genuine PostgreSQL 23505 for the loser, with only one winner persisted", async () => {
  const claimId = `q1-runtime-claim-concurrency-${runId}`;
  createdClaimIds.push(claimId);
  const now = new Date();

  await repo.create({
    claimId,
    versionId: randomUUID(),
    userId: userAId,
    claimType: "preference",
    valueKind: "text",
    valueText: "v1",
    provenance: "declared",
    confidence: 0.5,
    evidenceVersionId: null,
    inferenceId: null,
    evidenceLinkageState: "self_reported_no_evidence_required",
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: now,
    acceptedAt: now,
    now,
  });

  const correctionInput = (valueText: string) => ({
    claimId,
    versionId: randomUUID(),
    userId: userAId,
    valueKind: "text" as const,
    valueText,
    provenance: "declared" as const,
    confidence: 0.6,
    lifecycle: "active" as const,
    evidenceVersionId: null,
    inferenceId: null,
    evidenceLinkageState: "self_reported_no_evidence_required" as const,
    effectiveFrom: null,
    effectiveTo: null,
    situationSetting: null,
    timeOfDay: null,
    observedAt: new Date(),
    acceptedAt: new Date(),
    expectedVersion: 1,
    now: new Date(),
  });

  const [first, second] = await Promise.all([
    repo.appendCorrection(correctionInput("v2-attempt-a")),
    repo.appendCorrection(correctionInput("v2-attempt-b")),
  ]);

  const results = [first, second];
  assert.equal(results.filter((r) => r !== null).length, 1, "exactly one concurrent appendCorrection must win under the real unique(claim_id, version) constraint");
  assert.equal(results.filter((r) => r === null).length, 1, "exactly one concurrent appendCorrection must be rejected as null");

  const allVersions = await db
    .select()
    .from(personalIntelligenceClaimVersions)
    .where(eq(personalIntelligenceClaimVersions.claimId, claimId));
  assert.equal(allVersions.length, 2, "exactly two version rows must exist - v1 plus exactly one successful correction");
});

test("personal_intelligence_claim_versions_evidence_linkage_coupling_check: PostgreSQL itself rejects evidenceLinkageState = 'linked' with a null evidenceVersionId, independent of any application-code validation", async () => {
  const claimId = `q1-runtime-claim-coupling-${runId}`;
  createdClaimIds.push(claimId);
  const now = new Date();

  await db.insert(personalIntelligenceClaims).values({
    id: claimId,
    userId: userAId,
    claimType: "preference",
    createdAt: now,
    updatedAt: now,
  });

  await assert.rejects(
    () =>
      db.execute(
        sql`insert into decivexa.personal_intelligence_claim_versions
            (id, claim_id, user_id, version, value_kind, value_text, provenance, confidence, lifecycle, evidence_version_id, evidence_linkage_state, observed_at, accepted_at, created_at)
            values (${randomUUID()}, ${claimId}, ${userAId}, 1, 'text', 'coupling violation', 'declared', 0.5, 'active', null, 'linked', now(), now(), now())`,
      ),
    (error: unknown) => {
      const pgError = error as { code?: string; cause?: { code?: string } };
      const code = pgError.code ?? pgError.cause?.code;
      assert.equal(code, "23514", `expected PostgreSQL check-violation (23514) for the 1:1 linked/evidenceVersionId coupling, got ${code}`);
      return true;
    },
  );
});
