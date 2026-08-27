// Zone-3 AI Gateway — concurrency abstraction (Increment 013 Founder
// Decision 3 / Increment 014 §15).
//
// Policy posture is LOCKED: conservative, per Zone-2 workload identity,
// exhaustion = REJECT / FAIL-CLOSED — confirmed explicitly, no queue,
// no retry, no fallback, no silent degradation. The numeric ceiling is
// NOT invented here, for the same reason as workload-rate-limiter.port.ts:
// required constructor configuration, no default, structurally
// impossible to silently ship an unapproved number.
import { ConcurrencyExhaustedError } from "../errors/gateway.errors";

// Returned by tryAcquire() on success; release() consumes it. Modeled
// as an opaque token (not merely "call release(workloadId)") so a
// caller cannot accidentally release more permits than it acquired.
export interface ConcurrencyPermit {
  readonly workloadId: string;
}

export interface WorkloadConcurrencyGuardConfig {
  // No default anywhere in this file — see file header.
  readonly maxConcurrentPerWorkload: number;
}

// Local in-memory implementation — acceptable for this phase only
// (Increment 014 §15/§25); a real multi-instance deployment needs
// shared state, deferred identically to the rate limiter.
export class WorkloadConcurrencyGuard {
  private readonly inFlightByWorkload = new Map<string, number>();

  constructor(private readonly config: WorkloadConcurrencyGuardConfig) {}

  tryAcquire(workloadId: string): ConcurrencyPermit {
    const current = this.inFlightByWorkload.get(workloadId) ?? 0;
    if (current >= this.config.maxConcurrentPerWorkload) {
      throw new ConcurrencyExhaustedError(`Workload "${workloadId}" exhausted its concurrency limit`);
    }
    this.inFlightByWorkload.set(workloadId, current + 1);
    return { workloadId };
  }

  // Idempotent-safe against double-release within a single permit's
  // lifecycle only insofar as the orchestrator's own finally-block
  // discipline (gateway-request-handler.ts) calls this exactly once per
  // successful tryAcquire() — enforced by construction there (every exit
  // path — success, provider failure, timeout, malformed response,
  // audit failure, unexpected failure — routes through one finally
  // block), not by this class re-validating the permit's provenance.
  release(permit: ConcurrencyPermit): void {
    const current = this.inFlightByWorkload.get(permit.workloadId) ?? 0;
    if (current <= 1) {
      this.inFlightByWorkload.delete(permit.workloadId);
    } else {
      this.inFlightByWorkload.set(permit.workloadId, current - 1);
    }
  }
}
