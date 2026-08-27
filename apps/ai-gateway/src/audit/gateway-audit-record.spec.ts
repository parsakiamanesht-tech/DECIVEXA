import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryGatewayAuditSink, buildGatewayAuditRecord } from "./gateway-audit-record";
import { AlwaysFailingGatewayAuditSink } from "./gateway-audit-record.testkit";

test("buildGatewayAuditRecord includes every required field", () => {
  const record = buildGatewayAuditRecord({
    correlationId: "corr-1",
    capability: "gate7.controlled-execution",
    workloadId: "workload-a",
    providerId: "test-provider",
    modelId: "test-model",
    outcome: "success",
    latencyMs: 42,
  });
  assert.equal(record.correlationId, "corr-1");
  assert.equal(record.capability, "gate7.controlled-execution");
  assert.equal(record.workloadId, "workload-a");
  assert.equal(record.providerId, "test-provider");
  assert.equal(record.modelId, "test-model");
  assert.equal(record.outcome, "success");
  assert.equal(record.latencyMs, 42);
  assert.equal(typeof record.timestamp, "string");
});

test("buildGatewayAuditRecord omits optional fields entirely when absent, rather than including them as null/undefined", () => {
  const record = buildGatewayAuditRecord({
    correlationId: "corr-2",
    capability: "gate7.controlled-execution",
    workloadId: "workload-a",
    outcome: "failure",
    latencyMs: 5,
  });
  assert.equal("providerId" in record, false);
  assert.equal("modelId" in record, false);
  assert.equal("errorCategory" in record, false);
});

test("InMemoryGatewayAuditSink records and lists entries", async () => {
  const sink = new InMemoryGatewayAuditSink();
  const record = buildGatewayAuditRecord({ correlationId: "corr-3", capability: "c", workloadId: "w", outcome: "success", latencyMs: 1 });
  await sink.record(record);
  assert.deepEqual(sink.list(), [record]);
});

test("AlwaysFailingGatewayAuditSink always rejects (test fixture for the fail-closed audit path)", async () => {
  const sink = new AlwaysFailingGatewayAuditSink();
  await assert.rejects(() => sink.record(buildGatewayAuditRecord({ correlationId: "c", capability: "c", workloadId: "w", outcome: "success", latencyMs: 1 })));
});

test("the audit record shape has no field capable of carrying a credential, raw input, or raw provider payload (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "audit", "gateway-audit-record.ts"), "utf8");
  // Matched as an actual TypeScript property declaration (name followed
  // by "?:" or ":"), not prose — this file's own header comment
  // explains the guarantee in plain English using these exact words,
  // which must not itself fail this check; only a real field
  // declaration would.
  for (const forbidden of [/\bcredential\s*\??:/i, /\bapiKey\s*\??:/i, /\btoken\s*\??:/i, /\bsecret\s*\??:/i, /\brawInput\s*\??:/i, /\brawResponse\s*\??:/i, /\brawRequest\s*\??:/i]) {
    assert.equal(forbidden.test(source), false, `gateway-audit-record.ts must not declare a field matching ${forbidden}`);
  }
});
