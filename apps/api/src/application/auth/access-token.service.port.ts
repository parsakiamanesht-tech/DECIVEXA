export type AccessTokenClaims = Readonly<{
  userId: string;
  email: string;
  expiresAt: number;
}>;

export interface AccessTokenServicePort {
  issue(identity: Readonly<{ userId: string; email: string }>): string;
  verify(token: string): AccessTokenClaims | undefined;
}

export const ACCESS_TOKEN_SERVICE = Symbol("ACCESS_TOKEN_SERVICE");
