export class InfrastructureError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'InfrastructureError';
    this.code = code;
  }
}
