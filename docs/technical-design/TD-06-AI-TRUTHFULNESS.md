# TD-06 — AI Evaluation & Truthfulness Contract

**Status:** Proposed technical contract

## Objective

Ensure DECIVEXA's intelligence is evidence-grounded, uncertainty-aware, privacy-aware and agency-preserving.

## Information states

Every meaningful AI claim MUST be distinguishable as appropriate among:

- user-stated;
- observed;
- externally sourced evidence;
- system-derived observation;
- inference;
- recommendation;
- unknown/insufficient evidence.

## Provenance

High-impact recommendations and personal-model claims MUST retain sufficient provenance to answer: what evidence supports this, when was it observed, how was it derived, and how confident is the system?

## Uncertainty

The system MUST NOT present inference as fact. Confidence is not a substitute for evidence; low-confidence claims SHOULD trigger validation rather than stronger wording.

## Evaluation

AI capabilities MUST be evaluated for:

- factual grounding;
- evidence attribution;
- hallucination/fabrication rate;
- consistency;
- personalization quality;
- harmful overreach;
- privacy leakage;
- user-agency preservation;
- calibration of uncertainty;
- usefulness of recommendations.

## Human agency

AI may analyze, compare, simulate, recommend and guide. Consequential user decisions remain with the user unless an explicitly authorized deterministic rule governs a routine system action.

## Outage rule

During AI outage, DECIVEXA MUST NOT fabricate a new analysis, claim that a fresh analysis occurred, or silently substitute stale intelligence as current intelligence. Last Known Good State must be identifiable.

## Acceptance criteria

- Important AI claims are traceable to evidence or marked inference.
- Uncertainty is explicit where material.
- AI cannot silently convert guesses into permanent personal facts.
- Evaluation includes privacy and agency, not only model accuracy.
- Outage behavior never creates false intelligence.
