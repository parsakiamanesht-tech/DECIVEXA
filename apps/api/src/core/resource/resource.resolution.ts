import type { ResourceReference, ResourceType } from "./resource.reference";

export type ResourceResolutionFailureReason = "infrastructure";

export type ResourceResolutionResult<T> =
  | Readonly<{
      status: "resolved";
      resource: T;
    }>
  | Readonly<{
      status: "invalid_reference";
    }>
  | Readonly<{
      status: "unsupported_resource_type";
      resourceType: ResourceType;
    }>
  | Readonly<{
      status: "not_found";
    }>
  | Readonly<{
      status: "resolution_failure";
      reason: ResourceResolutionFailureReason;
    }>;

export type ResourceResolutionStrategy<T> = (
  reference: ResourceReference,
) => Promise<T | undefined>;

export function invalidReference(): ResourceResolutionResult<never> {
  return { status: "invalid_reference" };
}

export function unsupportedResourceType(
  resourceType: ResourceType,
): ResourceResolutionResult<never> {
  return { status: "unsupported_resource_type", resourceType };
}

export function notFound(): ResourceResolutionResult<never> {
  return { status: "not_found" };
}

export function resolutionFailure(): ResourceResolutionResult<never> {
  return { status: "resolution_failure", reason: "infrastructure" };
}

export function resolved<T>(resource: T): ResourceResolutionResult<T> {
  return { status: "resolved", resource };
}
