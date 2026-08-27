import test from "node:test";
import assert from "node:assert/strict";
import { parseGatewayRequest } from "./request.types";
import { MalformedRequestError } from "../errors/gateway.errors";

const VALID = { capability: "gate7.controlled-execution", input: { hello: "world" }, correlationId: "corr-1" };

test("parseGatewayRequest accepts the exact authorized envelope", () => {
  const result = parseGatewayRequest(VALID);
  assert.deepEqual(result, VALID);
});

test("parseGatewayRequest rejects a non-object body", () => {
  assert.throws(() => parseGatewayRequest("not an object"), MalformedRequestError);
  assert.throws(() => parseGatewayRequest(null), MalformedRequestError);
  assert.throws(() => parseGatewayRequest([1, 2, 3]), MalformedRequestError);
});

test("parseGatewayRequest rejects a missing capability", () => {
  const { capability, ...rest } = VALID;
  assert.throws(() => parseGatewayRequest(rest), MalformedRequestError);
});

test("parseGatewayRequest rejects an empty-string capability", () => {
  assert.throws(() => parseGatewayRequest({ ...VALID, capability: "" }), MalformedRequestError);
});

test("parseGatewayRequest rejects a missing input field", () => {
  const { input, ...rest } = VALID;
  assert.throws(() => parseGatewayRequest(rest), MalformedRequestError);
});

test("parseGatewayRequest accepts input: null as present (still a field, still opaque)", () => {
  const result = parseGatewayRequest({ ...VALID, input: null });
  assert.equal(result.input, null);
});

test("parseGatewayRequest rejects a missing correlationId", () => {
  const { correlationId, ...rest } = VALID;
  assert.throws(() => parseGatewayRequest(rest), MalformedRequestError);
});

test("parseGatewayRequest rejects an empty-string correlationId", () => {
  assert.throws(() => parseGatewayRequest({ ...VALID, correlationId: "" }), MalformedRequestError);
});

// INV-024 — the structural anti-generic-proxy boundary (Increment 014
// §6/§19): every one of these caller-supplied fields must be rejected by
// parsing itself, not by a downstream policy check.
for (const forbiddenField of [
  "providerUrl",
  "apiKey",
  "authorizationHeader",
  "provider",
  "model",
  "endpoint",
  "credential",
  "httpMethod",
  "headers",
  "rawUrl",
  "userId",
  "capabilityAuthorizationResult",
]) {
  test(`parseGatewayRequest rejects a caller-supplied "${forbiddenField}" field`, () => {
    assert.throws(() => parseGatewayRequest({ ...VALID, [forbiddenField]: "attacker-controlled-value" }), MalformedRequestError);
  });
}
