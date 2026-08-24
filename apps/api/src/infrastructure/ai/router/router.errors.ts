// Normalized router-boundary error (Increment 2B).
//
// Deterministic rejection: raised when no candidate among the ones the
// caller supplied is both registered-eligible (model and provider) and
// capability/limit-compatible with the given requirements. This is a
// selection outcome, never a provider/execution failure.
export class NoEligibleCandidateError extends Error {}
