import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRequest } from '../src/app.js';

function callHandler(method, url) {
  const response = {
    statusCode: undefined,
    headers: undefined,
    body: undefined,
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };

  handleRequest({ method, url }, response);

  return {
    statusCode: response.statusCode,
    headers: response.headers,
    body: JSON.parse(response.body),
  };
}

test('GET / returns service information', () => {
  const response = callHandler('GET', '/');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    name: 'devops-training-starter',
    message: 'Сервис запущен',
  });
});

test('GET /health returns healthy status', () => {
  const response = callHandler('GET', '/health');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('unknown route returns 404', () => {
  const response = callHandler('GET', '/missing');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { error: 'Not found' });
});
