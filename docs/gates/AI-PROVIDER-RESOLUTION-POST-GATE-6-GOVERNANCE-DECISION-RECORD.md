# Decision Record — AI Provider Resolution: Post-Gate-6 Governance State

## A. Decision Identity

- **Title:** Decision Record — AI Provider Resolution: Post-Gate-6 Governance State
- **Decision ID:** `FD-AI-PROVIDER-RESOLUTION-POST-GATE-6-001`
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Scope:** AI Infrastructure / AIRuntime Production-Wiring Validation lineage — Provider Resolution (Gates 1–6)

## B. Baseline

`HEAD` = `origin/main` = `15284d6ef392a63249cc0e613cd56be494502e9a` (the commit produced by Gate 4's push — the most recent implementation change in this lineage as of this record).

This record is a documentation-only persistence of decisions already reached in Founder-authorized conversation; it introduces no source, test, configuration, or architecture change of its own, and does not move the baseline.

## C. Lineage Recorded

This record persists the governance state reached after the following already-authorized, already-implemented, already-committed, already-pushed gates:

- **Gate 1** — `KeyedProviderResolver` created (pure keyed-map lookup implementing `ProviderResolutionPort`; empty map).
- **Gate 2a** — `KeyedProviderResolver` wired into production DI (`ai-runtime.module.ts`) as `AIRuntime`'s fourth, then-optional constructor argument.
- **Gate 2b** — `AIRuntime`'s fourth constructor argument (`providerResolutionPort`) made required, closing the "optional fourth dependency" architectural risk.
- **Gate 3** — Metadata-only registration: one provider metadata entry and one model metadata entry registered via the existing `toProviderRegistrationInput()` snapshot mechanism, using a credential-free, inert `OpenAiCompatibleProviderAdapter` literal solely to snapshot synchronous, side-effect-free accessors. `KeyedProviderResolver`'s production map remained empty after this gate.
- **Gate 4** — Provider instance construction + resolver map population: `KeyedProviderResolver`'s production map now contains exactly one `AIProvider` instance, keyed `"openai-compatible"`, constructed with the same explicit, hard-coded, credential-free config literal pattern Gate 3 established. `resolveOpenAiCompatibleProviderConfig()` was not called; no `AI_PROVIDER_*` environment variable was read.
- **Gate 5** — Read-only architecture audit of the State C → State D transition, identifying independent blockers: configuration/credentials, a capability-intent contradiction in `PERSONAL_STATE_INTERPRET_CAPABILITY`, controller reachability, observability, and security review.
- **Gate 6** — Read-only, narrow configuration/credential-wiring readiness audit. Verdict: **NOT READY** for Gate 6 implementation authorization, citing (i) absent `AI_PROVIDER_ENDPOINT`/`AI_PROVIDER_API_KEY`/`AI_PROVIDER_TIMEOUT_MS`, (ii) no governance authorization record for real credential consumption, (iii) an unresolved boot-failure design decision.
- **Post-Gate-6 Founder Decision Gate** — the Founder recorded the explicit decisions this document now persists.

## D. Current Architecture State (as of this record)

- The Provider Resolution State Model remains: **State A** (metadata registered) → **State B** (provider instance exists) → **State C** (instance resolvable via `KeyedProviderResolver`) → **State D** (real execution: network calls, `generate()`/`healthCheck()` invoked, `execute()` reachable).
- **State C is preserved** exactly as Gate 4 left it: `KeyedProviderResolver` resolves `"openai-compatible"` to a real, structurally complete `OpenAiCompatibleProviderAdapter` instance without invoking it.
- `resolveOpenAiCompatibleProviderConfig()` (`apps/api/src/infrastructure/ai/config/openai-compatible-provider.config.ts`) **remains unwired** — it is not called anywhere in production composition (`apps/api/src/infrastructure/ai-runtime/ai-runtime.module.ts`) or anywhere else in the AI Provider Resolution lineage.
- The Gate 4 inert, credential-free provider configuration literals (`{ endpoint: "unused-...-only", apiKey: null, timeoutMs: 1 }`, used independently for the Gate 3 metadata-snapshot instance and the Gate 4 resolver-map instance) **remain unchanged**.
- `AI_PROVIDER_ENDPOINT` is **not required for boot** by the currently authorized architecture: because `resolveOpenAiCompatibleProviderConfig()` is never called in production wiring, its synchronous `ProviderConfigurationError` throw on a missing/empty endpoint is never reached during application boot.
- `PERSONAL_STATE_INTERPRET_CAPABILITY` (`apps/api/src/infrastructure/ai/capability/personal-state-interpret.capability.ts`) **remains infrastructure-validation-only**: its own `purpose` field explicitly states it is not a product-facing AI capability and that no interpretation output is implemented by this increment.
- `AIRuntimeController` continues to expose only `route()`; `AIRuntime.execute()` has zero HTTP exposure anywhere in the application.

## E. Current Execution Boundary

**State D remains explicitly CLOSED** — closed by Founder decision, not merely by absence of implementation. Concretely, and as of this record's baseline:

- No production `execute()` reachability is authorized.
- No `generate()`, `healthCheck()`, or network execution is authorized.
- No AI provider adapter is invoked anywhere in production wiring.

## F. Decisions Intentionally Deferred (not resolved by this record)

- **Real `AI_PROVIDER_*` configuration** (endpoint, API key, timeout) is **not authorized**. No such value has been introduced, and none is authorized by this record.
- **Future credential consumption** requires a separate, explicit Founder authorization. This record does not grant it.
- **Future execution** (any State D transition — `generate()`, `healthCheck()`, `execute()` reachability, or network activity) requires a separate, explicit Founder authorization. This record does not grant it.
- **Observability requirements** for real production execution remain unresolved and must be explicitly reviewed before any real production execution — this record does not resolve them and does not treat their absence as acceptable for State D.
- **Boot-failure behavior** for any future real-configuration design (i.e., what should happen if `AI_PROVIDER_ENDPOINT` is introduced and found missing/invalid at boot) **remains unresolved**. This record does not decide it.
- **Any future capability-intent change** to `PERSONAL_STATE_INTERPRET_CAPABILITY` (moving it from infrastructure-validation-only toward a product-facing capability) requires explicit Founder authorization. This record does not grant it and does not alter the capability's current intent.

## G. Prerequisites for Future Configuration

Before real `AI_PROVIDER_*` configuration may be introduced or `resolveOpenAiCompatibleProviderConfig()` wired into production composition:

1. A separate, explicit Founder authorization naming the exact scope of the configuration change.
2. An explicit Founder decision resolving boot-failure behavior for a missing/invalid required value.
3. Confirmation that the governance boundary recorded in this document (no real credential consumption without separate authorization) has been formally superseded for that specific authorization only — not implicitly, and not for any broader scope.

## H. Prerequisites for Future Execution

Before any State D transition (real `generate()`/`healthCheck()`/`execute()` reachability or network activity) may be implemented:

1. A separate, explicit Founder authorization naming the exact execution scope.
2. Resolution of the `PERSONAL_STATE_INTERPRET_CAPABILITY` capability-intent contradiction identified in Gate 5 (or an explicit, separately authorized capability-intent change per Section F).
3. Explicit Founder review of observability requirements for real production execution.
4. Satisfaction of the configuration prerequisites in Section G, if real configuration is part of the execution path.

## I. Explicit Non-Authorizations

This record does **not** authorize:

- No real `AI_PROVIDER_*` value (endpoint, API key, or timeout) shall be introduced.
- No call to `resolveOpenAiCompatibleProviderConfig()` shall be added to production wiring.
- No call to `.generate(`, `.healthCheck(`, or any provider network invocation shall be added.
- No new HTTP route exposing `AIRuntime.execute()` shall be added.
- No change to `PERSONAL_STATE_INTERPRET_CAPABILITY`'s intent, `purpose`, or eligibility.
- No observability/logging/monitoring capability shall be added on the strength of this record alone.
- No Gate 7 (or any further implementation gate) scope is opened by this record.
- No commit, push, staging, or repository mutation beyond the creation of this single documentation file is authorized by this record.

## J. Historical Boundary

This record does not rewrite or reinterpret Gates 1 through 6, any Implementation Completion Report already delivered for them, or any prior governance record in `docs/gates/` or `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md`. All remain exactly as previously recorded. This record is additive persistence of an already-reached decision, in the same spirit as ADR-009's precedent of registering a decision after the corresponding implementation was already authorized, implemented, and accepted.

## K. Related Records

- `docs/DECIVEXA/ARCHITECTURE_DECISION_SOURCE_OF_TRUTH.md` — establishes GitHub repository documentation as the authoritative project source of truth and prohibits silent architectural drift (§14); this record exists to satisfy that requirement for the Post-Gate-6 decision.
- `docs/DECIVEXA/ARCHITECTURE_DECISIONS.md` (ADR-001–ADR-009) — general architecture decision log; ADR-009 is the structural precedent for post-hoc decision registration referenced in Section J.
- `apps/api/src/infrastructure/ai-runtime/ai-runtime.module.ts` — the production DI composition file implementing the state described in Section D.
- `apps/api/src/infrastructure/ai/runtime/ai-runtime.ts`, `provider-instance-resolver.ts`, `ai-runtime.controller.ts` — implementation files referenced by this record; none modified by it.
- `apps/api/src/infrastructure/ai/config/openai-compatible-provider.config.ts`, `apps/api/src/infrastructure/ai/adapters/openai-compatible-provider.adapter.ts` — referenced by this record; none modified by it.
- `apps/api/src/infrastructure/ai/capability/personal-state-interpret.capability.ts` — referenced by this record; not modified by it.

## L. Authorization Boundary

This governance record itself does **not** authorize implementation, credentials, execution, commit, or push. It is a durable persistence of decisions already reached; any future change to the state it describes requires its own separate, explicit Founder authorization, following the same gate sequence (Readiness Audit → Founder Authorization → Implementation → Audit → Commit Authorization → Push Authorization) used throughout this lineage.

## M. Final Determination

**FOUNDER DECISION PERSISTED — AI PROVIDER RESOLUTION STATE C PRESERVED — STATE D REMAINS CLOSED — NO CREDENTIAL AUTHORIZATION — NO EXECUTION AUTHORIZATION — GATE 7 NOT OPENED BY THIS RECORD**
