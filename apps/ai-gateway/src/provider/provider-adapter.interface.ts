// Zone-3 AI Gateway — independently-owned provider adapter interface
// (Increment 014 §11).
//
// Pattern-reused from apps/api's AIProvider (../../apps/api/src/
// infrastructure/ai/provider/ai-provider.interface.ts) — same proven
// shape, a fresh, independent implementation. NOT imported: Increment
// 014's authorization explicitly forbids importing any apps/api
// provider class (§11, §22).
//
// The request/result shapes here carry NOTHING caller-controlled:
// `providerId`/`modelId` are selected exclusively by gateway-policy.ts
// from its server-owned table, never from the Gateway's own request
// contract. `input` is passed through opaque and unread (contract/
// request.types.ts already documents why this is safe: it is
// size-bounded, never interpreted).
export interface GatewayProviderRequest {
  readonly providerId: string;
  readonly modelId: string;
  readonly input: unknown;
}

// A provider adapter yields its response as a chunked byte stream
// (mirroring a real HTTP response body) rather than a single buffered
// value — this is what makes genuine streaming, bounded response
// collection (transport-limits.ts's collectBoundedResponse) exercise a
// real code path even against a fake, in-process provider, instead of
// only being provable against imagined future network behavior.
export interface GatewayProviderResponse {
  readonly chunks: AsyncIterable<Uint8Array>;
}

export interface GatewayProvider {
  generate(request: GatewayProviderRequest): Promise<GatewayProviderResponse>;
}
