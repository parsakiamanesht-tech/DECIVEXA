import { createHmac, timingSafeEqual } from "node:crypto";

export type AccessTokenClaims = Readonly<{
  userId: string;
  email: string;
  expiresAt: number;
}>;

export class AccessTokenService {
  private readonly secret: string;
  private readonly ttlSeconds = 60 * 60;

  constructor() {
    this.secret = process.env.AUTH_TOKEN_SECRET ?? "";
    if (this.secret.length < 32) {
      throw new Error("AUTH_TOKEN_SECRET must be at least 32 characters");
    }
  }

  issue(identity: Readonly<{ userId: string; email: string }>): string {
    const claims: AccessTokenClaims = {
      userId: identity.userId,
      email: identity.email,
      expiresAt: Math.floor(Date.now() / 1000) + this.ttlSeconds,
    };
    const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
    return `${payload}.${this.sign(payload)}`;
  }

  verify(token: string): AccessTokenClaims | undefined {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return undefined;

    const expected = Buffer.from(this.sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return undefined;

    try {
      const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AccessTokenClaims;
      if (!claims.userId || !claims.email || !Number.isInteger(claims.expiresAt)) return undefined;
      if (claims.expiresAt <= Math.floor(Date.now() / 1000)) return undefined;
      return claims;
    } catch {
      return undefined;
    }
  }

  private sign(payload: string): string {
    return createHmac("sha256", this.secret).update(payload).digest("base64url");
  }
}
