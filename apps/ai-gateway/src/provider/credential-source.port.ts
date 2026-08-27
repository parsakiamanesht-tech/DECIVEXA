// Zone-3 AI Gateway — credential boundary abstraction ONLY (Increment
// 014 §12, Increment 010 Decision 2: Zone-3-only custody, preserved).
//
// This is an interface, nothing more. No GCP Secret Manager
// implementation, no real secret, no service account, no environment-
// file wiring is introduced by this file — those are external
// infrastructure (Phase E+, not authorized here). The interface exists
// so a future provider adapter implementation has a stable seam to
// resolve a credential through, without this Gateway ever exposing that
// value to apps/api (which never imports anything from this
// application at all), to a log line, to an error message
// (../errors/gateway.errors.ts's GatewayErrorCode vocabulary has no
// field capable of carrying one), or to an audit record
// (../audit/gateway-audit-record.ts's field shape is the same
// structural guarantee).
export interface CredentialSource {
  resolve(): Promise<string | null>;
}
