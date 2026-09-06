import { HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationError } from '../../shared/errors/application-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { ValidationError } from '../../shared/errors/validation-error';
import type { RequestContext } from '../../context/request-context';

type AuthApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

const PUBLIC_MESSAGES: Record<string, string> = {
  AUTH_INVALID_INPUT: 'The submitted authentication data is invalid.',
  AUTH_INVALID_CREDENTIALS: 'Invalid credentials.',
  AUTH_EMAIL_ALREADY_REGISTERED: 'The email address is already registered.',
  AUTH_INTERNAL_ERROR: 'Authentication could not be completed.',
};

function response(code: string, requestId: string): AuthApiError {
  return {
    error: {
      code,
      message: PUBLIC_MESSAGES[code] ?? PUBLIC_MESSAGES.AUTH_INTERNAL_ERROR,
      requestId,
    },
  };
}

export function mapAuthenticationError(
  error: unknown,
  context: RequestContext,
): HttpException {
  if (error instanceof ValidationError) {
    return new HttpException(response('AUTH_INVALID_INPUT', context.requestId), HttpStatus.BAD_REQUEST);
  }

  if (error instanceof AuthorizationError) {
    return new HttpException(
      response('AUTH_INVALID_CREDENTIALS', context.requestId),
      HttpStatus.UNAUTHORIZED,
    );
  }

  if (error instanceof ApplicationError) {
    if (error.code === 'EMAIL_ALREADY_REGISTERED') {
      return new HttpException(
        response('AUTH_EMAIL_ALREADY_REGISTERED', context.requestId),
        HttpStatus.CONFLICT,
      );
    }

    return new HttpException(response('AUTH_INTERNAL_ERROR', context.requestId), HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return new HttpException(response('AUTH_INTERNAL_ERROR', context.requestId), HttpStatus.INTERNAL_SERVER_ERROR);
}
