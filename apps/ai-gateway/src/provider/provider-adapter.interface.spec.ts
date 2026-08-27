import test from "node:test";
import assert from "node:assert/strict";
import { collectBoundedResponse } from "./transport-limits";
import { FakeSuccessfulGatewayProvider } from "./gateway-provider.testkit";

test("a GatewayProvider implementation yields its result as a chunked byte stream that reassembles correctly", async () => {
  const provider = new FakeSuccessfulGatewayProvider({ ok: true, value: 42 });
  const response = await provider.generate({ providerId: "p", modelId: "m", input: {} });
  const bytes = await collectBoundedResponse(response.chunks);
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  assert.deepEqual(parsed, { ok: true, value: 42 });
});

test("a GatewayProviderRequest carries only providerId/modelId/input — no caller-controlled transport field exists on the type (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "provider", "provider-adapter.interface.ts"), "utf8");
  for (const forbidden of ["providerUrl", "apiKey", "authorizationHeader", "rawUrl", "httpMethod", "headers"]) {
    assert.equal(source.includes(forbidden), false, `provider-adapter.interface.ts must not declare a "${forbidden}" field`);
  }
});
