// Zone-3 AI Gateway — correlationId handling (Increment 014 §18 /
// Increment 011 Decision 5, preserved unchanged).
//
// correlationId is a TRACEABILITY identifier only. It is explicitly NOT
// authentication, NOT authorization, NOT a credential, and NOT proof of
// identity — it carries no trust weight anywhere in this Gateway. No
// cryptographic or uniqueness verification is performed here: a
// colliding or predictable value degrades traceability only, never
// security (Increment 014 §6/§17).
import { randomUUID } from "node:crypto";
import { MalformedRequestError } from "../errors/gateway.errors";

// Generation uses the same node:crypto randomUUID() convention already
// established in apps/api's AuthenticationGuard — reused as a pattern
// (no import), not as a shared instance, per the non-interference
// constraint.
export function generateCorrelationId(): string {
  return randomUUID();
}

// Validates only that a correlationId is present and non-empty. No
// format, length, or uniqueness constraint is imposed — inventing one
// would be unnecessary infrastructure with no evidenced requirement
// (Increment 014 §18: "do not invent unnecessary uniqueness infrastructure").
export function assertValidCorrelationId(value: unknown): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new MalformedRequestError("correlationId must be a non-empty string");
  }
}
