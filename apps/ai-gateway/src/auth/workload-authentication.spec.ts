import test from "node:test";
import assert from "node:assert/strict";
import { WorkloadAuthenticationFailedError } from "./workload-authentication";
import { FakeWorkloadAuthenticator } from "./workload-authenticator.testkit";

const authenticator = new FakeWorkloadAuthenticator(new Map([["fake-credential-1", "workload-a"]]));

test("FakeWorkloadAuthenticator resolves a recognized credential to its workload identity", async () => {
  const result = await authenticator.authenticate("fake-credential-1");
  assert.deepEqual(result, { workloadId: "workload-a" });
});

test("FakeWorkloadAuthenticator rejects an unrecognized credential", async () => {
  await assert.rejects(() => authenticator.authenticate("forged-credential"), WorkloadAuthenticationFailedError);
});

test("FakeWorkloadAuthenticator rejects a non-string credential", async () => {
  await assert.rejects(() => authenticator.authenticate({ not: "a string" }), WorkloadAuthenticationFailedError);
  await assert.rejects(() => authenticator.authenticate(undefined), WorkloadAuthenticationFailedError);
});
