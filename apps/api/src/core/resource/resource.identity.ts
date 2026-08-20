/**
 * DECIVEXA Resource Identity Contract.
 *
 * Resource IDs are opaque, globally unique, application-generated and immutable.
 * The concrete ULID generation strategy is intentionally deferred until a
 * resource actually requires ID generation; this contract must not leak the
 * persistence implementation into domain code.
 */
export type ResourceId = string & { readonly __resourceIdBrand: unique symbol };

export function asResourceId(value: string): ResourceId {
  if (value.length === 0) {
    throw new Error("Resource ID must not be empty");
  }

  return value as ResourceId;
}

/**
 * Resource identity is independent from ownership, lifecycle, access,
 * transport and persistence implementation.
 */
export type ResourceIdentity = Readonly<{
  id: ResourceId;
}>;
