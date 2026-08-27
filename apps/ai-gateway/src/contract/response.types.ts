// Zone-3 AI Gateway — normalized response contract (Increment 014 §8).
//
// A GatewayResponse is the ONLY shape ever returned across the Zone-2
// boundary. It never carries a raw provider payload, a raw provider
// error message, a stack trace, a credential, or an endpoint — success
// responses carry only `output` (the provider adapter's already-
// normalized result), and error responses carry only a fixed
// GatewayErrorCode (see ../errors/gateway.errors.ts). apps/api's own
// authorizeOutputPolicy() remains authoritative for whatever it does
// with `output` after receiving this response — that responsibility is
// never duplicated or absorbed here.
import type { GatewayErrorCode } from "../errors/gateway.errors";

export interface GatewaySuccessResponse {
  readonly status: "success";
  readonly output: unknown;
  readonly correlationId: string;
}

export interface GatewayErrorResponse {
  readonly status: "error";
  readonly errorCode: GatewayErrorCode;
  readonly correlationId: string;
}

export type GatewayResponse = GatewaySuccessResponse | GatewayErrorResponse;

export function successResponse(output: unknown, correlationId: string): GatewaySuccessResponse {
  return { status: "success", output, correlationId };
}

export function errorResponse(errorCode: GatewayErrorCode, correlationId: string): GatewayErrorResponse {
  return { status: "error", errorCode, correlationId };
}
