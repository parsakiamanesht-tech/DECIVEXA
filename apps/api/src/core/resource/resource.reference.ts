import type { ResourceId } from "./resource.identity";

/** Stable domain-level reference to a DECIVEXA resource. */
export type ResourceType = "workspace";

export type ResourceReference = Readonly<{
  resourceType: ResourceType;
  resourceId: ResourceId;
}>;

export function createResourceReference(
  resourceType: ResourceType,
  resourceId: ResourceId,
): ResourceReference {
  return { resourceType, resourceId };
}
