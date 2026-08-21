import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequestContext } from '../context/request-context';
import { DomainError } from '../domain/domain-error';
import { success } from '../shared/result/result';


test('request context is immutable and carries only request identity plus optional user identity', () => {
  const context = createRequestContext('request-1', 'user-1');

  assert.deepEqual(context, { requestId: 'request-1', userId: 'user-1' });
  assert.equal(Object.isFrozen(context), true);
});

test('result contract represents success without coupling to infrastructure', () => {
  assert.deepEqual(success('ok'), { ok: true, value: 'ok' });
});

test('domain errors remain plain domain errors', () => {
  const error = new DomainError('GOAL_NOT_READY', 'Goal is not ready');

  assert.equal(error.name, 'DomainError');
  assert.equal(error.code, 'GOAL_NOT_READY');
  assert.equal(error.message, 'Goal is not ready');
});
