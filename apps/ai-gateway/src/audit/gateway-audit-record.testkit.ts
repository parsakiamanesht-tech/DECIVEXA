// Test support only — NOT a production implementation.
import type { GatewayAuditRecord, GatewayAuditSink } from "./gateway-audit-record";

// Always fails to durably record — exists solely so the orchestrator's
// fail-closed-on-audit-failure behavior (Increment 011 Decision 3 /
// Increment 013 §F: "the provider execution result must NOT be
// released") is exercised through the real pipeline in tests, not
// merely asserted in isolation.
export class AlwaysFailingGatewayAuditSink implements GatewayAuditSink {
  async record(_entry: GatewayAuditRecord): Promise<void> {
    throw new Error("Simulated durable audit-write failure (test fixture)");
  }
}
