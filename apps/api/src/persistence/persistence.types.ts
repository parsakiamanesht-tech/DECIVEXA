export type TransactionBoundary = {
  readonly mode: "request" | "unit-of-work";
};

export type IdempotencyKey = string;

export type PersistenceResult<T> = {
  readonly value: T;
  readonly created: boolean;
};

export interface PersistenceRepository<T> {
  findById(id: string): Promise<T | null>;
  save(value: T, idempotencyKey?: IdempotencyKey): Promise<PersistenceResult<T>>;
}
