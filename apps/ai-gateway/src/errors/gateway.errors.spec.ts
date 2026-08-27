import test from "node:test";
import assert from "node:assert/strict";
import {
  AuditPersistenceFailedError,
  ConcurrencyExhaustedError,
  MalformedProviderResponseError,
  MalformedRequestError,
  ProviderResponseTooLargeError,
  ProviderTimeoutError,
  ProviderTransportError,
  RateLimitExceededError,
  RequestTooLargeError,
  UnauthorizedCapabilityError,
  WorkloadAuthenticationFailedError,
  WorkloadAuthorizationDeniedError,
  errorCodeFor,
} from "./gateway.errors";

test("errorCodeFor maps every typed Gateway error to its exact stable code", () => {
  assert.equal(errorCodeFor(new MalformedRequestError()), "malformed_request");
  assert.equal(errorCodeFor(new RequestTooLargeError()), "request_too_large");
  assert.equal(errorCodeFor(new UnauthorizedCapabilityError()), "unauthorized_capability");
  assert.equal(errorCodeFor(new WorkloadAuthenticationFailedError()), "authentication_failed");
  assert.equal(errorCodeFor(new WorkloadAuthorizationDeniedError()), "authorization_denied");
  assert.equal(errorCodeFor(new RateLimitExceededError()), "rate_limit_exceeded");
  assert.equal(errorCodeFor(new ConcurrencyExhaustedError()), "concurrency_exhausted");
  assert.equal(errorCodeFor(new ProviderTimeoutError()), "provider_timeout");
  assert.equal(errorCodeFor(new ProviderTransportError()), "provider_transport_error");
  assert.equal(errorCodeFor(new ProviderResponseTooLargeError()), "provider_response_too_large");
  assert.equal(errorCodeFor(new MalformedProviderResponseError()), "malformed_provider_response");
  assert.equal(errorCodeFor(new AuditPersistenceFailedError()), "audit_persistence_failed");
});

test("errorCodeFor falls back to unexpected_error for anything untyped, never leaking the raw message", () => {
  assert.equal(errorCodeFor(new Error("some raw internal detail")), "unexpected_error");
  assert.equal(errorCodeFor("not even an Error instance"), "unexpected_error");
  assert.equal(errorCodeFor(undefined), "unexpected_error");
});
