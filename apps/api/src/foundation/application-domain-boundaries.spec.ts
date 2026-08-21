import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequestContext } from '../context/request-context';
import { DomainError } from '../domain/domain-error';
import { ApplicationError } from '../shared/errors/application-error';
import { AuthorizationError } from '../shared/errors/authorization-error';
import { InfrastructureError } from '../shared/errors/infrastructure-error';
import { ValidationError } from '../shared/errors/validation-error';
import { failure, success } from '../shared/result/result';
import type { ApplicationUseCase } from '../application/application-use-case';


test('request context is immutable and carries only request identity plus optional user identity', () => {
  const context = createRequestContext('request-1', 'user-1');

  assert.deepEqual(context, { requestId: 'request-1', userId: 'user-1' });
  assert.equal(Object.isFrozen(context), true);
});

test('application use case receives explicit request context', async () => {
  const context = createRequestContext('request-2', 'user-2');
  const useCase: ApplicationUseCase<{ value: string }, string> = {
    async execute(input, receivedContext) {
      assert.deepEqual(receivedContext, context);
      return success(input.value);
    },
  };

  assert.deepEqual(await useCase.execute({ value: 'ok' }, context), { ok: true, value: 'ok' });
});

test('result contract represents success and failure without coupling to infrastructure', () => {
  assert.deepEqual(success('ok'), { ok: true, value: 'ok' });
  assert.deepEqual(failure({ code: 'TEST_FAILURE', message: 'failed' }), {
    ok: false,
    error: { code: 'TEST_FAILURE', message: 'failed' },
  });
});

test('domain and application boundary errors preserve their contracts', () => {
  const domainError = new DomainError('GOAL_NOT_READY', 'Goal is not ready');
  const applicationError = new ApplicationError('USE_CASE_FAILED', 'Use case failed');

  assert.equal(domainError.name, 'DomainError');
  assert.equal(domainError.code, 'GOAL_NOT_READY');
  assert.equal(applicationError.name, 'ApplicationError');
  assert.equal(applicationError.code, 'USE_CASE_FAILED');
});

test('authorization, validation, and infrastructure errors preserve stable error categories', () => {
  const authorizationError = new AuthorizationError();
  const validationError = new ValidationError('Invalid input');
  const infrastructureError = new InfrastructureError('DB_UNAVAILABLE', 'Database unavailable');

  assert.equal(authorizationError.name, 'AuthorizationError');
  assert.equal(authorizationError.code, 'AUTHORIZATION_ERROR');
  assert.equal(validationError.name, 'ValidationError');
  assert.equal(validationError.code, 'VALIDATION_ERROR');
  assert.equal(infrastructureError.name, 'InfrastructureError');
  assert.equal(infrastructureError.code, 'DB_UNAVAILABLE');
});
