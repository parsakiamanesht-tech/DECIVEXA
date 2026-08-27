// Zone-3 AI Gateway — request contract (Increment 014 §6, Increment 011
// Decisions 4/5 preserved unchanged).
//
// The envelope is EXACTLY {capability, input, correlationId} — nothing
// more. This is the INV-024 anti-generic-proxy boundary enforced
// structurally: parseGatewayRequest() rejects ANY additional top-level
// key (providerUrl, apiKey, authorizationHeader, model, provider,
// endpoint, raw HTTP method/headers, userId, capability-authorization-
// result — all of it), not merely omitting them from the TypeScript
// type. A caller cannot smuggle a forbidden field past this boundary by
// sending raw JSON that a type-only check would never see at runtime.
import { MalformedRequestError } from "../errors/gateway.errors";
import { assertValidCorrelationId } from "../correlation/correlation-id";

export interface GatewayRequest {
  readonly capability: string;
  // Opaque structured data. The Gateway assigns it no semantic meaning
  // and never interprets it — see gateway-policy.ts / provider-adapter
  // for the only two things ever done with it (routing key lookup by
  // `capability`, never by `input`; and pass-through to the provider
  // adapter, size-bounded, unread).
  readonly input: unknown;
  readonly correlationId: string;
}

const ALLOWED_KEYS = new Set<string>(["capability", "input", "correlationId"]);

// Runtime validation of an already-JSON-parsed value. Deliberately
// stricter than the TypeScript type alone: rejects any object carrying
// an extra key, not just one missing a required key — this is what
// makes rejection of caller-supplied provider/model/endpoint/credential/
// raw-HTTP fields (Increment 014 §19, tests 9–13) a structural property
// of parsing itself, not a downstream policy check that could be
// bypassed by calling a different code path.
export function parseGatewayRequest(value: unknown): GatewayRequest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new MalformedRequestError("Gateway request body must be a JSON object");
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  for (const key of keys) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new MalformedRequestError(`Gateway request body contains an unrecognized field: "${key}"`);
    }
  }

  if (typeof record.capability !== "string" || record.capability.length === 0) {
    throw new MalformedRequestError("Gateway request body must include a non-empty string \"capability\"");
  }
  if (!("input" in record)) {
    throw new MalformedRequestError("Gateway request body must include an \"input\" field");
  }
  assertValidCorrelationId(record.correlationId);

  return {
    capability: record.capability,
    input: record.input,
    correlationId: record.correlationId as string,
  };
}
