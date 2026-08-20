import type { ResourceId } from "./resource.identity";

/** Stable domain-level reference to a DECIVEXA resource. */
export type ResourceType = string;

export type ResourceReference<T extends ResourceType = ResourceType> = Readonly<{
  resourceType: T;
  resourceId: ResourceId;
}>;

export function createResourceReference<T extends ResourceType>(
  resourceType: T,
  resourceId: ResourceId,
): ResourceReference<T> {
  return { resourceType, resourceId };
}
