import { isAllowedRequest } from './is-allowed-request';

describe('is-allowed-request', () => {
  it('returns true if request does not start with POST', () => {
    const result = isAllowedRequest('GET / HTTP/1.1');

    expect(result).toBe(true);
  });

  it.todo('returns true if POST, and path is whitelisted');

  it.todo('returns false if POST, and path is not whitelisted');

  it.todo('returns false if POST, and request is malformed');
});
