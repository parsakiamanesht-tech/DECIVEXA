import test from "node:test";
import assert from "node:assert/strict";
import { assertValidCorrelationId, generateCorrelationId } from "./correlation-id";
import { MalformedRequestError } from "../errors/gateway.errors";

test("generateCorrelationId produces a non-empty string", () => {
  const id = generateCorrelationId();
  assert.equal(typeof id, "string");
  assert.ok(id.length > 0);
});

test("generateCorrelationId produces distinct values across calls (traceability, not a security property)", () => {
  const a = generateCorrelationId();
  const b = generateCorrelationId();
  assert.notEqual(a, b);
});

test("assertValidCorrelationId accepts any non-empty string", () => {
  assert.doesNotThrow(() => assertValidCorrelationId("anything-at-all"));
});

test("assertValidCorrelationId rejects an empty string", () => {
  assert.throws(() => assertValidCorrelationId(""), MalformedRequestError);
});

test("assertValidCorrelationId rejects a non-string value", () => {
  assert.throws(() => assertValidCorrelationId(12345), MalformedRequestError);
  assert.throws(() => assertValidCorrelationId(null), MalformedRequestError);
  assert.throws(() => assertValidCorrelationId(undefined), MalformedRequestError);
});
