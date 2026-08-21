export type Result<T> = Success<T> | Failure;

export type Success<T> = {
  readonly ok: true;
  readonly value: T;
};

export type Failure = {
  readonly ok: false;
  readonly error: Error;
};

export const success = <T>(value: T): Success<T> => ({ ok: true, value });

export const failure = (error: Error): Failure => ({ ok: false, error });
