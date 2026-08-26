// Gate 7 controlled-execution lineage identifiers (Founder Implementation
// Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE IMPLEMENTATION",
// §3, Decision 1).
//
// These identifiers exist solely to isolate the Gate-7 controlled-execution
// lineage from the existing, unmodified Gate 3/4 inert infrastructure-
// validation provider/model ("openai-compatible" /
// "decivexa-infra-validation-placeholder-model"). No other capability may
// route to GATE7_PROVIDER_ID/GATE7_MODEL_ID, and the Gate-7 lineage never
// reuses or broadens the existing inert identifiers.
export const GATE7_PROVIDER_ID = "decivexa-gate7-controlled-openai-compatible";
export const GATE7_MODEL_ID = "decivexa-gate7-controlled-execution-model";
