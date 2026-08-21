import test from "node:test";
import assert from "node:assert/strict";
import { PasswordService } from "./password.service";

test("PasswordService hashes and verifies passwords", async () => {
  const service = new PasswordService();
  const encoded = await service.hash("correct horse battery staple");

  assert.notEqual(encoded, "correct horse battery staple");
  assert.equal(await service.verify("correct horse battery staple", encoded), true);
  assert.equal(await service.verify("wrong password", encoded), false);
});
