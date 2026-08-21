export type RequestContext = {
  readonly requestId: string;
  readonly userId?: string;
};

export function createRequestContext(requestId: string, userId?: string): RequestContext {
  return Object.freeze({ requestId, ...(userId ? { userId } : {}) });
}
