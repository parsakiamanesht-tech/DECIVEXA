export interface PasswordServicePort {
  hash(password: string): Promise<string>;
  verify(password: string, encoded: string): Promise<boolean>;
}

export const PASSWORD_SERVICE = Symbol("PASSWORD_SERVICE");
