import { Injectable } from "@nestjs/common";

@Injectable()
export class PersistenceService {
  getBoundary(): "request" | "unit-of-work" {
    return "request";
  }

  isIdempotencyKeyValid(key: string): boolean {
    return key.trim().length > 0;
  }
}
