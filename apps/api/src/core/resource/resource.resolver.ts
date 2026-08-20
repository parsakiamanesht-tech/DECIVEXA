import type { ResourceReference, ResourceType } from "./resource.reference";
import {
  invalidReference,
  notFound,
  resolutionFailure,
  resolved,
  unsupportedResourceType,
  type ResourceResolutionResult,
  type ResourceResolutionStrategy,
} from "./resource.resolution";

export type ResourceResolutionStrategyRegistry = Readonly<
  Record<ResourceType, ResourceResolutionStrategy<unknown>>
>;

function isValidReference(reference: ResourceReference): boolean {
  return (
    typeof reference === "object" &&
    reference !== null &&
    typeof reference.resourceType === "string" &&
    reference.resourceType.length > 0 &&
    typeof reference.resourceId === "string" &&
    reference.resourceId.length > 0
  );
}

export class ResourceResolver {
  constructor(private readonly strategies: ResourceResolutionStrategyRegistry) {}

  async resolve<T>(reference: ResourceReference): Promise<ResourceResolutionResult<T>> {
    if (!isValidReference(reference)) {
      return invalidReference();
    }

    const strategy = this.strategies[reference.resourceType];
    if (!strategy) {
      return unsupportedResourceType(reference.resourceType);
    }

    try {
      const resource = await strategy(reference);
      return resource === undefined ? notFound() : resolved(resource as T);
    } catch {
      return resolutionFailure();
    }
  }
}
