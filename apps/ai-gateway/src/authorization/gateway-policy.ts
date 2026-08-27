// Zone-3 AI Gateway — Gateway-owned authorization (Increment 014 §10,
// INV-007).
//
// Structural separation, preserved exactly as decided (Increment
// 010/011/013, not reopened):
//
//   apps/api  decides: "may this end user use this capability?"
//             — exclusively authorizePolicy(), never re-derived here.
//   Zone-3    decides: "is this authenticated workload allowed to
//             invoke the Gateway, and does this capability map to an
//             approved provider/model?"
//
// Deliberately the smallest mechanism that satisfies INV-007: a plain,
// server-owned lookup table, not a class hierarchy. This is NOT a
// second CapabilityRegistry/ModelRouter/policy-engine — it has no
// registration API, no eligibility flags, no dynamic mutation, and
// resolves nothing from caller input. Evidence for "smallest sufficient
// mechanism" is unchanged from the Increment 014 design report §9/§25:
// at most a handful of capabilities will ever route through this
// Gateway, each to exactly one provider/model pair.
import { UnauthorizedCapabilityError, WorkloadAuthorizationDeniedError } from "../errors/gateway.errors";

export interface GatewayCapabilityRoute {
  readonly providerId: string;
  readonly modelId: string;
}

// Server-owned only. No entry here is ever derived from a request.
export type GatewayCapabilityTable = Readonly<Record<string, GatewayCapabilityRoute>>;

// Server-owned only. No entry here is ever derived from a request. This
// is the INV-006/INV-007 invoker allowlist — the set of workload
// identities permitted to call this Gateway at all, independent of
// which capability they request.
export type GatewayWorkloadAllowlist = ReadonlySet<string>;

export function authorizeGatewayInvocation(
  workloadId: string,
  capability: string,
  allowlist: GatewayWorkloadAllowlist,
  table: GatewayCapabilityTable,
): GatewayCapabilityRoute {
  if (!allowlist.has(workloadId)) {
    throw new WorkloadAuthorizationDeniedError(`Workload "${workloadId}" is not on the Gateway invoker allowlist`);
  }

  const route = table[capability];
  if (!route) {
    throw new UnauthorizedCapabilityError(`Capability "${capability}" has no approved provider/model mapping at the Gateway`);
  }

  return route;
}
