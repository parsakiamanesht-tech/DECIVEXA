// Zone-3 AI Gateway — rate-limit abstraction (Increment 013 Founder
// Decision 2 / Increment 014 §14).
//
// Policy posture is LOCKED: conservative, per Zone-2 workload identity,
// fail-closed. The NUMERIC threshold is explicitly NOT locked and is
// NOT invented here — this module accepts it only as required
// constructor configuration with no default, so it is structurally
// impossible to "silently" ship a number nobody decided. Every caller
// (today, only this module's own tests) must supply its own explicit
// value; production wiring has none to supply yet, and none is
// authorized by this phase. No burst allowance and no global
// Gateway-wide ceiling are implemented — both remain open per
// Increment 013, unreopened here.
import { RateLimitExceededError } from "../errors/gateway.errors";

export type RateLimitDecision = "allowed" | "rejected";

export interface WorkloadRateLimiter {
  checkAndConsume(workloadId: string): Promise<RateLimitDecision>;
}

export interface WorkloadRateLimiterConfig {
  // No default value anywhere in this file — see file header. Callers
  // must supply an explicit number; this interface exists to make that
  // requirement a compile-time fact, not a runtime convention.
  readonly maxRequestsPerWindow: number;
  readonly windowMs: number;
}

// Local/in-memory implementation — acceptable for this phase's local
// skeleton/testing only (Increment 014 §14/§25). A multi-instance
// production deployment needs shared state (e.g. a distributed
// counter); that is explicitly deferred, external infrastructure work,
// not designed further here.
export class InMemoryWorkloadRateLimiter implements WorkloadRateLimiter {
  private readonly windowStartByWorkload = new Map<string, number>();
  private readonly countByWorkload = new Map<string, number>();

  constructor(private readonly config: WorkloadRateLimiterConfig) {}

  async checkAndConsume(workloadId: string): Promise<RateLimitDecision> {
    const now = Date.now();
    const windowStart = this.windowStartByWorkload.get(workloadId);

    // Start a fresh window, but fall through to the same count check
    // below rather than unconditionally allowing — a configured limit
    // of 0 must reject even the very first request in a brand-new
    // window (fail-closed applies from the first call, not only after
    // some prior state exists).
    if (windowStart === undefined || now - windowStart >= this.config.windowMs) {
      this.windowStartByWorkload.set(workloadId, now);
      this.countByWorkload.set(workloadId, 0);
    }

    const count = this.countByWorkload.get(workloadId) ?? 0;
    if (count >= this.config.maxRequestsPerWindow) {
      return "rejected";
    }

    this.countByWorkload.set(workloadId, count + 1);
    return "allowed";
  }
}

// Fail-closed helper for orchestration callers: throws rather than
// returning a boolean, matching every other fail-closed check in this
// Gateway's request pipeline.
export async function assertWithinRateLimit(limiter: WorkloadRateLimiter, workloadId: string): Promise<void> {
  const decision = await limiter.checkAndConsume(workloadId);
  if (decision === "rejected") {
    throw new RateLimitExceededError(`Workload "${workloadId}" exceeded its rate limit`);
  }
}
