import type { CapabilityRegistry } from "../capability/capability-registry";
import { GATE7_CONTROLLED_EXECUTION_CAPABILITY } from "../capability/gate7-controlled-execution.capability";
import { GATE7_MODEL_ID, GATE7_PROVIDER_ID } from "../gate7/gate7-identifiers";
import type { Gate7ExecutionAuditSink } from "../observability/execution-audit";
import { buildGate7ExecutionAuditRecord } from "../observability/execution-audit";
import { OutputValidationRejectedError } from "../validation/validation.errors";
import { PolicyAuthorizationDeniedError } from "../policy/policy.errors";
import type { ModelRouter } from "../router/model-router";
import type { RequestContext } from "../../../context/request-context";
import { AIRuntime } from "./ai-runtime";
import type { ContextResolutionPort } from "./context-resolution.port";
import type { ProviderResolutionPort } from "./provider-resolution.port";

// ============================================================================
// TEMPORARY / FOUNDER-AUTHORIZED — Gate 7 First Controlled Smoke Test Harness
// ============================================================================
//
// Founder Implementation Authorization: "GATE 7 — DECISION-SCOPED
// PREREQUISITE IMPLEMENTATION", §6 (Decision 4) / FD-2(A, Temporary).
//
// This file is explicitly TEMPORARY. It exists solely to perform and
// verify the future first tightly controlled real-provider smoke test,
// once a SEPARATE Founder authorization permits real credentials and real
// network execution (FD-6). It must be removed after that smoke test
// succeeds or is abandoned, and must never become a permanent execution
// surface without its own new, separate Founder authorization (FD-2).
//
// - NOT imported by app.module.ts.
// - NOT imported by ai-runtime.module.ts.
// - NOT imported by any other production composition file.
// - NOT reachable through HTTP, a worker, a queue, or a cron job — this
//   file exports a class only; nothing in this repository constructs or
//   invokes it outside its own spec file.
// - Invokes exactly one capability (gate7.controlled-execution) and
//   targets exactly one provider/model identity pair
//   (GATE7_PROVIDER_ID / GATE7_MODEL_ID — ../gate7/gate7-identifiers.ts).
// - Enforces single invocation: a second call on the same harness
//   instance always fails closed with Gate7SmokeTestAlreadyInvokedError,
//   regardless of the first call's outcome, rather than performing a
//   second execution.
// - Contains no credential literal of any kind; never logs, prints, or
//   persists a credential; never fabricates or unwraps a raw provider
//   error — only the already-typed errors AIRuntime/the adapter/the
//   gate7 modules produce ever surface from runOnce().
// - This implementation phase provides and tests this harness using
//   fakes/mocks only (see the accompanying .spec.ts). It does NOT perform
//   a real external provider call, and nothing in this file is wired to
//   run automatically against real configuration — a caller supplies its
//   own dependencies (fake today; the real Gate-7 composite resolver only
//   under a future, separate execution authorization).
export class Gate7SmokeTestAlreadyInvokedError extends Error {}

export interface Gate7SmokeTestDependencies {
  readonly capabilityRegistry: CapabilityRegistry;
  readonly modelRouter: ModelRouter;
  readonly contextResolutionPort: ContextResolutionPort;
  readonly providerResolutionPort: ProviderResolutionPort;
  readonly auditSink: Gate7ExecutionAuditSink;
  readonly runtimeVersion: string;
}

export class FirstControlledSmokeTestHarness {
  private invoked = false;

  constructor(private readonly deps: Gate7SmokeTestDependencies) {}

  // Runs the single authorized Gate-7 invocation. Safe to call in this
  // implementation phase only with fake/mock dependencies (see the
  // accompanying spec) — this method performs no capability, provider, or
  // network selection of its own; it exercises exactly whatever
  // AIRuntime.execute() (unmodified) does with the injected dependencies.
  async runOnce(context: RequestContext): Promise<void> {
    if (this.invoked) {
      throw new Gate7SmokeTestAlreadyInvokedError(
        "This Gate 7 smoke test harness instance has already been invoked once; construct a new instance for another attempt.",
      );
    }
    this.invoked = true;

    const runtime = new AIRuntime(this.deps.capabilityRegistry, this.deps.modelRouter, this.deps.contextResolutionPort, this.deps.providerResolutionPort);

    const startedAt = Date.now();
    let validationOutcome: "accepted" | "rejected" | "not-reached" = "not-reached";
    let policyOutcome: "authorized" | "denied" | "not-reached" = "not-reached";
    let executionOutcome: "success" | "failure" = "failure";
    let failureType: string | undefined;
    let usage: { inputTokens: number; outputTokens: number } | undefined;

    try {
      const result = await runtime.execute({
        capabilityId: GATE7_CONTROLLED_EXECUTION_CAPABILITY.capabilityId,
        candidateModelIds: [GATE7_MODEL_ID],
        context,
      });
      policyOutcome = "authorized";
      validationOutcome = "accepted";
      executionOutcome = "success";
      usage = result.usage ? { inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens } : undefined;
    } catch (error) {
      failureType = error instanceof Error ? error.constructor.name : "UnknownError";
      // A PolicyAuthorizationDeniedError means the pipeline reached and
      // was rejected by Policy Authorization. Any other error type means
      // the pipeline got at least as far as Policy Authorization actually
      // running and passing (every earlier stage — normalizeTask,
      // capability lookup, context resolution — throws its own distinct
      // error type before authorizePolicy() ever executes), so
      // policyOutcome is "authorized" for every other failure.
      policyOutcome = error instanceof PolicyAuthorizationDeniedError ? "denied" : "authorized";
      if (error instanceof OutputValidationRejectedError) {
        validationOutcome = "rejected";
      }
      throw error;
    } finally {
      this.deps.auditSink.record(
        buildGate7ExecutionAuditRecord({
          correlationId: context.requestId,
          capabilityId: GATE7_CONTROLLED_EXECUTION_CAPABILITY.capabilityId,
          capabilityVersion: GATE7_CONTROLLED_EXECUTION_CAPABILITY.version,
          riskClassification: GATE7_CONTROLLED_EXECUTION_CAPABILITY.riskClassification,
          privacyClassification: GATE7_CONTROLLED_EXECUTION_CAPABILITY.privacyClassification,
          providerId: GATE7_PROVIDER_ID,
          modelId: GATE7_MODEL_ID,
          latencyMs: Date.now() - startedAt,
          usage,
          validationOutcome,
          policyOutcome,
          executionOutcome,
          runtimeVersion: this.deps.runtimeVersion,
          failureType,
        }),
      );
    }
  }
}
