import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { RequestContext } from "../../context/request-context";
import type { PersonalState, PersonalStateAvailability, PersonalStateProvenance } from "../../core/personal-state/personal-state.model";
import { PERSONAL_STATE_REPOSITORY } from "../../core/personal-state/personal-state.repository.token";
import type { PersonalStatePatch, PersonalStateRepository } from "../../core/personal-state/personal-state.repository";
import { failure, success, type Result } from "../../shared/result/result";

export type PersonalStateInput = Readonly<{
  timezone?: string | null;
  locale?: string | null;
  availability?: PersonalStateAvailability | null;
  provenance?: PersonalStateProvenance;
}>;

export class PersonalStateValidationError extends Error {}
export class PersonalStateNotFoundError extends Error {}
export class PersonalStateConflictError extends Error {}

function validate(input: PersonalStateInput): PersonalStateInput {
  if (input.timezone !== undefined && input.timezone !== null && (input.timezone.trim().length < 1 || input.timezone.length > 100)) {
    throw new PersonalStateValidationError("Invalid timezone");
  }
  if (input.locale !== undefined && input.locale !== null && (input.locale.trim().length < 2 || input.locale.length > 20)) {
    throw new PersonalStateValidationError("Invalid locale");
  }
  return input;
}

@Injectable()
export class PersonalStateUseCase {
  constructor(@Inject(PERSONAL_STATE_REPOSITORY) private readonly repository: PersonalStateRepository) {}

  async get(context: RequestContext): Promise<Result<PersonalState>> {
    if (!context.userId) return failure(new PersonalStateValidationError("Authenticated user required"));
    const state = await this.repository.findByUserId(context.userId);
    if (!state) return failure(new PersonalStateNotFoundError("Personal state not initialized"));
    return success(state);
  }

  async initialize(input: PersonalStateInput, context: RequestContext): Promise<Result<PersonalState>> {
    if (!context.userId) return failure(new PersonalStateValidationError("Authenticated user required"));
    try {
      const existing = await this.repository.findByUserId(context.userId);
      if (existing) return success(existing);
      const value = validate(input);
      return success(await this.repository.create({
        id: randomUUID(), userId: context.userId,
        timezone: value.timezone?.trim() ?? null,
        locale: value.locale?.trim() ?? null,
        availability: value.availability ?? null,
        provenance: value.provenance ?? "declared",
        now: new Date(),
      }));
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid personal state"));
    }
  }

  async update(input: PersonalStateInput & { revision: number }, context: RequestContext): Promise<Result<PersonalState>> {
    if (!context.userId) return failure(new PersonalStateValidationError("Authenticated user required"));
    if (!Number.isInteger(input.revision) || input.revision < 1) return failure(new PersonalStateValidationError("Invalid revision"));
    try {
      const value = validate(input);
      const patch: PersonalStatePatch = {
        timezone: value.timezone,
        locale: value.locale,
        availability: value.availability,
        provenance: value.provenance,
      };
      const updated = await this.repository.updateForUser(context.userId, input.revision, patch, new Date());
      if (!updated) return failure(new PersonalStateConflictError("Revision conflict or state not initialized"));
      return success(updated);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid personal state"));
    }
  }
}
