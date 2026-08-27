// Test support only — NOT a production implementation. No real network
// call, no real provider, no real credential occurs anywhere in this
// file.
import type { GatewayProvider, GatewayProviderRequest, GatewayProviderResponse } from "./provider-adapter.interface";
import { ProviderTransportError } from "../errors/gateway.errors";

function chunksOf(bytes: Uint8Array, chunkSize = 4096): AsyncIterable<Uint8Array> {
  return (async function* () {
    for (let offset = 0; offset < bytes.byteLength; offset += chunkSize) {
      yield bytes.subarray(offset, Math.min(offset + chunkSize, bytes.byteLength));
    }
    if (bytes.byteLength === 0) {
      // Ensure at least one (empty) yield so an empty-body case still
      // exercises the async generator path.
      yield new Uint8Array(0);
    }
  })();
}

// Returns a fixed, valid JSON output, chunked to simulate a real
// streamed HTTP body.
export class FakeSuccessfulGatewayProvider implements GatewayProvider {
  constructor(private readonly output: unknown = { ok: true }) {}

  async generate(_request: GatewayProviderRequest): Promise<GatewayProviderResponse> {
    const bytes = new TextEncoder().encode(JSON.stringify(this.output));
    return { chunks: chunksOf(bytes) };
  }
}

// Never resolves within any reasonable test timeout — used to exercise
// the 30s (or a test-shortened) timeout boundary via
// transport-limits.ts's withTimeout(). This models a hanging
// `generate()` CALL itself.
export class FakeHangingGatewayProvider implements GatewayProvider {
  async generate(): Promise<GatewayProviderResponse> {
    return new Promise<GatewayProviderResponse>(() => {
      /* deliberately never resolves */
    });
  }
}

// Corrective-pass regression fixture (pre-commit review Finding 1):
// `generate()` resolves PROMPTLY — unlike FakeHangingGatewayProvider
// above — but the `chunks` async iterable it returns never yields and
// never completes. This is the exact scenario that slipped past the
// original test suite: a defective orchestrator that only wrapped
// `generate()` in a timeout, not the subsequent stream consumption,
// would hang indefinitely on this fixture while a correct one bounds
// the combined operation.
export class FakeStreamHangingGatewayProvider implements GatewayProvider {
  async generate(): Promise<GatewayProviderResponse> {
    return {
      chunks: (async function* (): AsyncIterable<Uint8Array> {
        // Yield nothing, ever — await a promise that never resolves so
        // the generator itself never reaches a yield or a return.
        await new Promise<never>(() => {
          /* deliberately never resolves */
        });
      })(),
    };
  }
}

// Rejects immediately, simulating a network/transport-level failure
// (never a real network call).
export class FakeFailingGatewayProvider implements GatewayProvider {
  async generate(): Promise<GatewayProviderResponse> {
    throw new ProviderTransportError("Simulated provider transport failure (test fixture)");
  }
}

// Yields a chunk stream whose total size exceeds the locked 64 KiB
// response cap — used to exercise collectBoundedResponse()'s streaming
// cancellation through the real orchestration path.
export class FakeOversizedGatewayProvider implements GatewayProvider {
  constructor(private readonly totalBytes: number) {}

  async generate(): Promise<GatewayProviderResponse> {
    const bytes = new Uint8Array(this.totalBytes).fill(97); // 'a'
    return { chunks: chunksOf(bytes) };
  }
}

// Returns syntactically invalid JSON — used to exercise
// MalformedProviderResponseError.
export class FakeMalformedGatewayProvider implements GatewayProvider {
  async generate(): Promise<GatewayProviderResponse> {
    const bytes = new TextEncoder().encode("{ not valid json");
    return { chunks: chunksOf(bytes) };
  }
}
