import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryGate7ExecutionAuditSink, buildGate7ExecutionAuditRecord } from "./execution-audit";

const BASE_INPUT = {
  correlationId: "req-1",
  capabilityId: "gate7.controlled-execution",
  capabilityVersion: "1.0",
  riskClassification: "informational-read-only",
  privacyClassification: "standard",
  providerId: "decivexa-gate7-controlled-openai-compatible",
  modelId: "decivexa-gate7-controlled-execution-model",
  latencyMs: 12,
  validationOutcome: "accepted" as const,
  policyOutcome: "authorized" as const,
  executionOutcome: "success" as const,
  runtimeVersion: "test-runtime-1",
};

test("buildGate7ExecutionAuditRecord captures exactly the FD-4 required fields on success", () => {
  const record = buildGate7ExecutionAuditRecord(BASE_INPUT);
  assert.equal(record.correlationId, "req-1");
  assert.equal(record.capabilityId, "gate7.controlled-execution");
  assert.equal(record.routeDecision, "routed");
  assert.equal(record.executionOutcome, "success");
  assert.equal("usage" in record, false, "usage must be omitted, not undefined, when not supplied");
  assert.equal("failureType" in record, false, "failureType must be omitted, not undefined, when not supplied");
});

test("buildGate7ExecutionAuditRecord includes usage only when explicitly supplied", () => {
  const record = buildGate7ExecutionAuditRecord({ ...BASE_INPUT, usage: { inputTokens: 3, outputTokens: 5 } });
  assert.deepEqual(record.usage, { inputTokens: 3, outputTokens: 5 });
});

test("buildGate7ExecutionAuditRecord records a typed failure without any raw error/payload content", () => {
  const record = buildGate7ExecutionAuditRecord({
    ...BASE_INPUT,
    validationOutcome: "not-reached",
    policyOutcome: "denied",
    executionOutcome: "failure",
    failureType: "PolicyAuthorizationDeniedError",
  });
  assert.equal(record.executionOutcome, "failure");
  assert.equal(record.failureType, "PolicyAuthorizationDeniedError");
});

test("the record's own type never has a field capable of carrying a raw prompt, raw response, or credential (structural)", () => {
  const record = buildGate7ExecutionAuditRecord(BASE_INPUT);
  const keys = Object.keys(record);
  const forbidden = ["prompt", "context", "rawResponse", "apiKey", "authorization", "credential", "secret"];
  for (const key of keys) {
    for (const term of forbidden) {
      assert.equal(key.toLowerCase().includes(term.toLowerCase()), false, `record must not have a field named like "${term}": found "${key}"`);
    }
  }
});

test("InMemoryGate7ExecutionAuditSink records and lists entries, immutably", () => {
  const sink = new InMemoryGate7ExecutionAuditSink();
  const record = buildGate7ExecutionAuditRecord(BASE_INPUT);
  sink.record(record);

  const listed = sink.list();
  assert.equal(listed.length, 1);
  assert.deepEqual(listed[0], record);
  assert.throws(() => {
    // @ts-expect-error - list() must return frozen, read-only entries
    listed[0].executionOutcome = "failure";
  });
});
