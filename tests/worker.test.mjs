import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

test('public host redirects preserve path and query without fetching assets', async () => {
  const env = { ASSETS: { fetch: () => { throw new Error('redirect should not fetch assets'); } } };
  for (const origin of ['http://usmanramzan.com', 'http://www.usmanramzan.com', 'https://www.usmanramzan.com']) {
    const response = await worker.fetch(new Request(`${origin}/work-with-me/?source=linkedin`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://usmanramzan.com/work-with-me/?source=linkedin');
  }
});

test('HTML responses include UTF-8 while retaining status, body and cache headers', async () => {
  for (const status of [200, 404]) {
    const env = { ASSETS: { fetch: () => new Response('Consulting through URN Labs', { status, headers: { 'Content-Type': 'text/html', ETag: 'test' } }) } };
    const response = await worker.fetch(new Request('https://usmanramzan.com/example/'), env);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('Content-Type'), 'text/html; charset=utf-8');
    assert.equal(response.headers.get('ETag'), 'test');
    assert.equal(await response.text(), 'Consulting through URN Labs');
  }
});

test('non-HTML assets and local previews retain their original content type', async () => {
  const env = { ASSETS: { fetch: () => new Response('asset', { headers: { 'Content-Type': 'image/avif' } }) } };
  const response = await worker.fetch(new Request('http://127.0.0.1:4328/portrait.avif'), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'image/avif');
});
