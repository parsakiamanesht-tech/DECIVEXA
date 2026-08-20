import assert from "node:assert/strict";
import test from "node:test";
import { assertWorkspaceAccess, canAccessWorkspace } from "./workspace.access";

const ownerWorkspace = { ownerId: "owner-1" };

test("owner can read and write a workspace", () => {
  assert.equal(canAccessWorkspace("owner-1", ownerWorkspace, "read"), true);
  assert.equal(canAccessWorkspace("owner-1", ownerWorkspace, "write"), true);
  assert.doesNotThrow(() => assertWorkspaceAccess("owner-1", ownerWorkspace, "read"));
  assert.doesNotThrow(() => assertWorkspaceAccess("owner-1", ownerWorkspace, "write"));
});

test("non-owner cannot read or write a workspace", () => {
  assert.equal(canAccessWorkspace("owner-2", ownerWorkspace, "read"), false);
  assert.equal(canAccessWorkspace("owner-2", ownerWorkspace, "write"), false);
  assert.throws(
    () => assertWorkspaceAccess("owner-2", ownerWorkspace, "read"),
    /Workspace access denied/,
  );
  assert.throws(
    () => assertWorkspaceAccess("owner-2", ownerWorkspace, "write"),
    /Workspace access denied/,
  );
});
