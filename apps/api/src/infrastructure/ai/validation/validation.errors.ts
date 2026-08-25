// Normalized Output Validation boundary error (Founder Implementation
// Authorization: "Output Validation - AUTHORIZED, STRUCTURAL-ONLY").
//
// Raised only by assertOutputAccepted() in output-validation.ts, and
// only against synthetic fixture inputs in tests - never against a real
// AIRuntime.execute() result, because execute() remains hard-blocked
// and this error is never wired into any execution path in this
// increment.
export class OutputValidationRejectedError extends Error {}
