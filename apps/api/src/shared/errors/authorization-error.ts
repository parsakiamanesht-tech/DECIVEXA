export class AuthorizationError extends Error {
  readonly code = 'AUTHORIZATION_ERROR';

  constructor(message = 'Authorization failed') {
    super(message);
    this.name = 'AuthorizationError';
  }
}
