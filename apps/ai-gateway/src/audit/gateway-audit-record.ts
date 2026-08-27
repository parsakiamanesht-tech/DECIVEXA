// Zone-3 AI Gateway — Gateway-owned audit boundary (Increment 010
// Decision 4 / Increment 011 Decision 3 / Increment 014 §16).
//
// Separately owned from apps/api's Gate7ExecutionAuditRecord — no
// import, no shared schema, correlated ONLY via correlationId (Increment
// 010 Decision 4, preserved). Field shape mirrors
// Gate7ExecutionAuditRecord's own narrow, non-sensitive discipline: the
// builder's parameter shape has no field capable of carrying a
// credential, raw input, raw provider request, raw provider response,
// or token — this is a structural guarantee, not a policy one.
export type GatewayAuditOutcome = "success" | "failure";

export interface GatewayAuditRecord {
  readonly correlationId: string;
  readonly capability: string;
  readonly workloadId: string;
  readonly providerId?: string;
  readonly modelId?: string;
  readonly outcome: GatewayAuditOutcome;
  readonly errorCategory?: string;
  readonly timestamp: string;
  readonly latencyMs: number;
}

export interface BuildGatewayAuditRecordInput {
  readonly correlationId: string;
  readonly capability: string;
  readonly workloadId: string;
  readonly providerId?: string;
  readonly modelId?: string;
  readonly outcome: GatewayAuditOutcome;
  readonly errorCategory?: string;
  readonly latencyMs: number;
}

// Pure builder — the only way to construct a GatewayAuditRecord. Its
// parameter shape has no field capable of carrying secret material, so
// there is no way to accidentally capture one, mirroring
// buildGate7ExecutionAuditRecord()'s own discipline.
export function buildGatewayAuditRecord(input: BuildGatewayAuditRecordInput): GatewayAuditRecord {
  return {
    correlationId: input.correlationId,
    capability: input.capability,
    workloadId: input.workloadId,
    ...(input.providerId ? { providerId: input.providerId } : {}),
    ...(input.modelId ? { modelId: input.modelId } : {}),
    outcome: input.outcome,
    ...(input.errorCategory ? { errorCategory: input.errorCategory } : {}),
    timestamp: new Date().toISOString(),
    latencyMs: input.latencyMs,
  };
}

// Narrow write-only sink interface — mirrors Gate7ExecutionAuditSink's
// own discipline. A future production implementation of this same
// interface (durable persistence) is external infrastructure, not
// designed further here.
export interface GatewayAuditSink {
  record(entry: GatewayAuditRecord): Promise<void>;
}

// In-memory only; records are lost on process exit. Sufficient for this
// phase's local skeleton/testing only — never a durable audit store.
export class InMemoryGatewayAuditSink implements GatewayAuditSink {
  private readonly entries: GatewayAuditRecord[] = [];

  async record(entry: GatewayAuditRecord): Promise<void> {
    this.entries.push(Object.freeze({ ...entry }));
  }

  list(): readonly GatewayAuditRecord[] {
    return this.entries;
  }
}
