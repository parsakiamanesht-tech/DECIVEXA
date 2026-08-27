import test from "node:test";
import assert from "node:assert/strict";
import { errorResponse, successResponse } from "./response.types";

test("successResponse produces exactly {status, output, correlationId}", () => {
  const result = successResponse({ answer: 42 }, "corr-1");
  assert.deepEqual(Object.keys(result).sort(), ["correlationId", "output", "status"]);
  assert.equal(result.status, "success");
  assert.deepEqual(result.output, { answer: 42 });
  assert.equal(result.correlationId, "corr-1");
});

test("errorResponse produces exactly {status, errorCode, correlationId} — never a raw message field", () => {
  const result = errorResponse("provider_timeout", "corr-2");
  assert.deepEqual(Object.keys(result).sort(), ["correlationId", "errorCode", "status"]);
  assert.equal(result.status, "error");
  assert.equal(result.errorCode, "provider_timeout");
  assert.equal(result.correlationId, "corr-2");
});
