import assert from "node:assert/strict";
import test from "node:test";
import {
  assertPersonalIntelligenceClaimAccess,
  canAccessPersonalIntelligenceClaim,
  type PersonalIntelligenceAccessAction,
} from "./personal-intelligence-claim.access";

const ownedClaim = { userId: "user-1" };

test("owner can read and write their own personal intelligence claim", () => {
  assert.equal(canAccessPersonalIntelligenceClaim("user-1", ownedClaim, "read"), true);
  assert.equal(canAccessPersonalIntelligenceClaim("user-1", ownedClaim, "write"), true);
  assert.doesNotThrow(() =>
    assertPersonalIntelligenceClaimAccess("user-1", ownedClaim, "read"),
  );
  assert.doesNotThrow(() =>
    assertPersonalIntelligenceClaimAccess("user-1", ownedClaim, "write"),
  );
});

test("non-owner cannot read or write another user's personal intelligence claim", () => {
  assert.equal(canAccessPersonalIntelligenceClaim("user-2", ownedClaim, "read"), false);
  assert.equal(canAccessPersonalIntelligenceClaim("user-2", ownedClaim, "write"), false);
  assert.throws(
    () => assertPersonalIntelligenceClaimAccess("user-2", ownedClaim, "read"),
    /Personal Intelligence claim access denied/,
  );
  assert.throws(
    () => assertPersonalIntelligenceClaimAccess("user-2", ownedClaim, "write"),
    /Personal Intelligence claim access denied/,
  );
});

test("an action outside read/write is denied by default, even for the owner", () => {
  const unsupportedAction = "delete" as unknown as PersonalIntelligenceAccessAction;

  assert.equal(canAccessPersonalIntelligenceClaim("user-1", ownedClaim, unsupportedAction), false);
  assert.throws(
    () => assertPersonalIntelligenceClaimAccess("user-1", ownedClaim, unsupportedAction),
    /Personal Intelligence claim access denied/,
  );
});
