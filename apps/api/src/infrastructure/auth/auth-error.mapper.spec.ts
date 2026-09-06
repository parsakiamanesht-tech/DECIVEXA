import { strict as assert } from 'node:assert';
import test from 'node:test';
import { HttpException } from '@nestjs/common';
import { ApplicationError } from '../../shared/errors/application-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { ValidationError } from '../../shared/errors/validation-error';
import { createRequestContext } from '../../context/request-context';
import { mapAuthenticationError } from './auth-error.mapper';

const context = createRequestContext('test-request');

function bodyOf(exception: HttpException): unknown {
  return exception.getResponse();
}

test('maps validation failures to a stable 400 authentication contract', () => {
  const exception = mapAuthenticationError(new ValidationError('email is required'), context);

  assert.equal(exception.getStatus(), 400);
  assert.deepEqual(bodyOf(exception), {
    error: {
      code: 'AUTH_INVALID_INPUT',
      message: 'The submitted authentication data is invalid.',
      requestId: 'test-request',
    },
  });
});

test('maps credential failures to a stable 401 authentication contract', () => {
  const exception = mapAuthenticationError(new AuthorizationError('secret internal detail'), context);

  assert.equal(exception.getStatus(), 401);
  assert.deepEqual(bodyOf(exception), {
    error: {
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid credentials.',
      requestId: 'test-request',
    },
  });
});

test('maps duplicate registration to a stable 409 authentication contract', () => {
  const exception = mapAuthenticationError(
    new ApplicationError('EMAIL_ALREADY_REGISTERED', 'database-specific detail'),
    context,
  );

  assert.equal(exception.getStatus(), 409);
  assert.deepEqual(bodyOf(exception), {
    error: {
      code: 'AUTH_EMAIL_ALREADY_REGISTERED',
      message: 'The email address is already registered.',
      requestId: 'test-request',
    },
  });
});

test('does not expose unknown application errors', () => {
  const exception = mapAuthenticationError(
    new ApplicationError('INTERNAL_DATABASE_DETAIL', 'sensitive database detail'),
    context,
  );

  assert.equal(exception.getStatus(), 500);
  assert.deepEqual(bodyOf(exception), {
    error: {
      code: 'AUTH_INTERNAL_ERROR',
      message: 'Authentication could not be completed.',
      requestId: 'test-request',
    },
  });
});

test('does not expose unknown thrown values', () => {
  const exception = mapAuthenticationError(new Error('sensitive implementation detail'), context);

  assert.equal(exception.getStatus(), 500);
  assert.deepEqual(bodyOf(exception), {
    error: {
      code: 'AUTH_INTERNAL_ERROR',
      message: 'Authentication could not be completed.',
      requestId: 'test-request',
    },
  });
});
