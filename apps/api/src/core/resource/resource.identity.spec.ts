import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { asResourceId } from "./resource.identity";
import { createResourceReference } from "./resource.reference";

describe("resource identity contract", () => {
  it("accepts a non-empty opaque id", () => {
    const id = asResourceId("01KTESTRESOURCE000000000000");

    assert.equal(id, "01KTESTRESOURCE000000000000");
  });

  it("rejects an empty id", () => {
    assert.throws(
      () => asResourceId(""),
      /Resource ID must not be empty/,
    );
  });

  it("creates a stable typed resource reference", () => {
    const id = asResourceId("01KTESTRESOURCE000000000000");

    assert.deepEqual(createResourceReference("workspace", id), {
      resourceType: "workspace",
      resourceId: id,
    });
  });
});
