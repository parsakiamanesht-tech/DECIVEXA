import test from "node:test";
import assert from "node:assert/strict";
import { AccessTokenService } from "./access-token.service";

process.env.AUTH_TOKEN_SECRET = "decivexa-test-auth-token-secret-0123456789";

test("AccessTokenService issues and verifies tokens", () => {
  const service = new AccessTokenService();
  const token = service.issue({ userId: "user-1", email: "user@example.com" });
  const claims = service.verify(token);

  assert.equal(claims?.userId, "user-1");
  assert.equal(claims?.email, "user@example.com");
  assert.equal(service.verify(`${token}tampered`), undefined);
});
