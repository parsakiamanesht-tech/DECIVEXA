import { describe, expect, it } from "vitest";
import { asResourceId } from "./resource.identity";
import { createResourceReference } from "./resource.reference";

describe("resource identity contract", () => {
  it("accepts a non-empty opaque id", () => {
    const id = asResourceId("01KTESTRESOURCE000000000000");

    expect(id).toBe("01KTESTRESOURCE000000000000");
  });

  it("rejects an empty id", () => {
    expect(() => asResourceId("")).toThrow("Resource ID must not be empty");
  });

  it("creates a stable typed resource reference", () => {
    const id = asResourceId("01KTESTRESOURCE000000000000");

    expect(createResourceReference("workspace", id)).toEqual({
      resourceType: "workspace",
      resourceId: id,
    });
  });
});
