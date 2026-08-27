// Zone-3 AI Gateway — workload authentication seam (Increment 014 §9,
// INV-006).
//
// Architecture (Increment 009 §G, Founder-approved, NOT redesigned
// here): Zone-2 workload -> Google-signed OIDC ID token -> Gateway
// verifies signature/issuer/audience -> authenticated workload
// identity. This file implements only the SEAM (an interface a real
// verifier will implement) plus the typed result/error shapes. No real
// GCP audience, service account, IAM binding, or OIDC/JWT verification
// library is introduced here — real verification is external
// infrastructure (Increment 014 §9/§24, Phase D of §22 in the prior
// design report explicitly separates the interface from real
// verification). A fake/stub implementation for tests lives in
// workload-authenticator.testkit.ts, co-located per this repository's
// existing convention (apps/api never separates test support into its
// own tree) but distinctly named so it is never mistaken for a
// production implementation.
import { WorkloadAuthenticationFailedError } from "../errors/gateway.errors";

// Deliberately minimal: the only thing anything downstream of
// authentication needs is "which workload is this" — never the raw
// token, never claims beyond what identifies the workload. This is the
// end-user-identity boundary's mirror image: Zone-3 never learns an end
// user's identity (Increment 010/011, unchanged), and here the
// application-of-record for an end user (apps/api) never learns the
// workload's raw credential either.
export interface AuthenticatedWorkload {
  readonly workloadId: string;
}

// The opaque credential a Zone-2 workload presents. In production this
// is a Google-signed OIDC ID token (a string); kept as `unknown` here so
// this interface makes no assumption about transport (header, gRPC
// metadata, etc.) — a concern Phase E/F, not this phase, resolves.
export interface WorkloadAuthenticator {
  authenticate(credential: unknown): Promise<AuthenticatedWorkload>;
}

// Thrown by any WorkloadAuthenticator implementation on failure; the
// orchestrator (../orchestration/gateway-request-handler.ts) catches
// this specific type and fails closed via WorkloadAuthenticationFailedError
// — re-exported here only for callers that want to construct the same
// failure without importing the errors module directly.
export { WorkloadAuthenticationFailedError };
