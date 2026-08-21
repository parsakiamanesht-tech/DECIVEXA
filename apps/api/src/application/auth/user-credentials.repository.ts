export type UserCredentials = Readonly<{
  id: string;
  email: string;
  passwordHash: string;
}>;

export interface UserCredentialsRepository {
  findByEmail(email: string): Promise<UserCredentials | undefined>;
  create(input: Readonly<{ id: string; email: string; passwordHash: string; now: Date }>): Promise<UserCredentials>;
}

export const USER_CREDENTIALS_REPOSITORY = Symbol("USER_CREDENTIALS_REPOSITORY");
