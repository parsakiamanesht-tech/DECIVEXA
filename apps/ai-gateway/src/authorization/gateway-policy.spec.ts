import test from "node:test";
import assert from "node:assert/strict";
import { authorizeGatewayInvocation, type GatewayCapabilityTable } from "./gateway-policy";
import { UnauthorizedCapabilityError, WorkloadAuthorizationDeniedError } from "../errors/gateway.errors";

const TABLE: GatewayCapabilityTable = {
  "gate7.controlled-execution": { providerId: "test-provider", modelId: "test-model" },
};
const ALLOWLIST = new Set(["workload-a"]);

test("authorizeGatewayInvocation returns the server-owned route for an allowlisted workload and known capability", () => {
  const route = authorizeGatewayInvocation("workload-a", "gate7.controlled-execution", ALLOWLIST, TABLE);
  assert.deepEqual(route, { providerId: "test-provider", modelId: "test-model" });
});

test("authorizeGatewayInvocation denies a workload not on the invoker allowlist, before consulting the capability table", () => {
  assert.throws(() => authorizeGatewayInvocation("workload-untrusted", "gate7.controlled-execution", ALLOWLIST, TABLE), WorkloadAuthorizationDeniedError);
});

test("authorizeGatewayInvocation rejects a capability with no approved provider/model mapping", () => {
  assert.throws(() => authorizeGatewayInvocation("workload-a", "unknown.capability", ALLOWLIST, TABLE), UnauthorizedCapabilityError);
});

test("authorizeGatewayInvocation never derives a route from anything but the server-owned table (no caller-controlled provider/model)", () => {
  // The function's signature accepts no provider/model argument at all —
  // this test documents that structural fact by confirming the returned
  // route is always exactly the table's entry, regardless of anything
  // else about the call.
  const route = authorizeGatewayInvocation("workload-a", "gate7.controlled-execution", ALLOWLIST, TABLE);
  assert.equal(route.providerId, TABLE["gate7.controlled-execution"].providerId);
  assert.equal(route.modelId, TABLE["gate7.controlled-execution"].modelId);
});
