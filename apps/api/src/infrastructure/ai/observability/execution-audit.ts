// Minimum Gate-7 execution observability/audit record (Founder
// Implementation Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE
// IMPLEMENTATION", FD-4, §9).
//
// This is NOT the future full DECIVEXA telemetry/evaluation platform — no
// OpenTelemetry, no distributed tracing, no quality scoring, no analytics
// dashboard. It is the smallest data structure and in-memory sink needed
// to make exactly one controlled Gate-7 execution attributable and
// auditable, per FD-4's own explicit minimum-scope instruction.
//
// The record captures only the fields FD-4 explicitly lists. It never
// contains: raw user context, raw prompts, the raw provider response, an
// API key, an authorization header, any credential, or any secret-bearing
// configuration value — buildGate7ExecutionAuditRecord()'s parameter
// shape makes it structurally impossible to pass one of those in.
export type Gate7ExecutionOutcome = "success" | "failure";
export type Gate7ValidationOutcome = "accepted" | "rejected" | "not-reached";
export type Gate7PolicyOutcome = "authorized" | "denied" | "not-reached";

export interface Gate7ExecutionUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
}

export interface Gate7ExecutionAuditRecord {
  readonly correlationId: string;
  readonly capabilityId: string;
  readonly capabilityVersion: string;
  readonly riskClassification: string;
  readonly privacyClassification: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly routeDecision: "routed";
  readonly latencyMs: number;
  readonly usage?: Gate7ExecutionUsage;
  readonly validationOutcome: Gate7ValidationOutcome;
  readonly policyOutcome: Gate7PolicyOutcome;
  readonly executionOutcome: Gate7ExecutionOutcome;
  readonly runtimeVersion: string;
  readonly failureType?: string;
}

// Narrow write-only sink interface: this phase's implementation
// (InMemoryGate7ExecutionAuditSink below) is sufficient for exactly one
// controlled smoke test — FD-4 explicitly forbids treating this as
// authorization to build persistent/durable audit storage. A future,
// separately authorized gate may supply a different implementation of
// this same interface without changing any caller.
export interface Gate7ExecutionAuditSink {
  record(entry: Gate7ExecutionAuditRecord): void;
}

// In-memory only; records are lost on process exit. Sufficient for one
// controlled, observed smoke test — not a durable audit store.
export class InMemoryGate7ExecutionAuditSink implements Gate7ExecutionAuditSink {
  private readonly entries: Gate7ExecutionAuditRecord[] = [];

  record(entry: Gate7ExecutionAuditRecord): void {
    this.entries.push(Object.freeze({ ...entry }));
  }

  list(): readonly Gate7ExecutionAuditRecord[] {
    return this.entries;
  }
}

export interface BuildGate7ExecutionAuditRecordInput {
  readonly correlationId: string;
  readonly capabilityId: string;
  readonly capabilityVersion: string;
  readonly riskClassification: string;
  readonly privacyClassification: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly latencyMs: number;
  readonly usage?: Gate7ExecutionUsage;
  readonly validationOutcome: Gate7ValidationOutcome;
  readonly policyOutcome: Gate7PolicyOutcome;
  readonly executionOutcome: Gate7ExecutionOutcome;
  readonly runtimeVersion: string;
  readonly failureType?: string;
}

// Pure builder — constructs a record from already-known, already-safe
// metadata only. Its parameter shape has no field capable of carrying a
// raw context/prompt/response/credential value, so there is no way to
// accidentally capture one.
export function buildGate7ExecutionAuditRecord(input: BuildGate7ExecutionAuditRecordInput): Gate7ExecutionAuditRecord {
  return {
    correlationId: input.correlationId,
    capabilityId: input.capabilityId,
    capabilityVersion: input.capabilityVersion,
    riskClassification: input.riskClassification,
    privacyClassification: input.privacyClassification,
    providerId: input.providerId,
    modelId: input.modelId,
    routeDecision: "routed",
    latencyMs: input.latencyMs,
    ...(input.usage ? { usage: input.usage } : {}),
    validationOutcome: input.validationOutcome,
    policyOutcome: input.policyOutcome,
    executionOutcome: input.executionOutcome,
    runtimeVersion: input.runtimeVersion,
    ...(input.failureType ? { failureType: input.failureType } : {}),
  };
}
