export type MemoryProvenance = "declared" | "observed";

export type MemoryLifecycle = "active" | "corrected" | "deleted";

// Value-encoding-kind discriminator for the unified Memory value/reference
// slot below. Founder-authorized as exactly these two values (Memory Schema
// Implementation Blocker Resolution, Blocker 1) - independently declared
// from PI Core's `PersonalIntelligenceValueKind`, never shared with it.
export type MemoryValueKind = "content" | "reference";

export type MemoryRecord = Readonly<{
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type MemoryRecordVersion = Readonly<{
  id: string;
  recordId: string;
  version: number;
  userId: string;
  provenance: MemoryProvenance;
  lifecycle: MemoryLifecycle;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  // Unified content/reference value slot (Founder-approved Model C
  // direction; Decision B - unified, not split). `valueKind` governs
  // interpretation: "content" means `value` holds inline Memory content;
  // "reference" means `value` holds a reference encoded as text. Both are
  // nullable - a version may carry no value at all, matching every
  // pre-increment record. No reference-target typing/validation is
  // implied or enforced here (deferred).
  valueKind: MemoryValueKind | null;
  value: string | null;
  // Independent user-confirmation dimension (Decision D.2), distinct from
  // provenance/lifecycle/confidence. Defaults to false and is never
  // derived from those fields - preserving TD-06's anti-poisoning
  // invariant: an inferred memory must never be silently represented as
  // user-confirmed. No confirmation workflow sets this to true in this
  // increment (deferred).
  userConfirmed: boolean;
  createdAt: Date;
}>;
