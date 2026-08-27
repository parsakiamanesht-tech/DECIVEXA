import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveOpenAiGatewayProviderConfig,
  OpenAiGatewayProviderConfigurationError,
} from "./openai-gateway-provider.config";

test("resolves a valid https endpoint from the environment", () => {
  const config = resolveOpenAiGatewayProviderConfig({ OPENAI_PROVIDER_ENDPOINT: "https://api.openai.com/v1" });
  assert.equal(config.endpoint, "https://api.openai.com/v1");
});

test("throws when OPENAI_PROVIDER_ENDPOINT is missing", () => {
  assert.throws(() => resolveOpenAiGatewayProviderConfig({}), OpenAiGatewayProviderConfigurationError);
});

test("throws when OPENAI_PROVIDER_ENDPOINT is empty/whitespace", () => {
  assert.throws(
    () => resolveOpenAiGatewayProviderConfig({ OPENAI_PROVIDER_ENDPOINT: "   " }),
    OpenAiGatewayProviderConfigurationError,
  );
});

test("throws when OPENAI_PROVIDER_ENDPOINT is not https", () => {
  assert.throws(
    () => resolveOpenAiGatewayProviderConfig({ OPENAI_PROVIDER_ENDPOINT: "http://api.openai.com/v1" }),
    OpenAiGatewayProviderConfigurationError,
  );
});

test("no default endpoint is ever assumed — no production URL is hardcoded anywhere in this module", () => {
  const source = require("node:fs").readFileSync(require.resolve("./openai-gateway-provider.config"), "utf8");
  assert.equal(/api\.openai\.com/.test(source), false, "must not hardcode OpenAI's production URL as a default");
});
