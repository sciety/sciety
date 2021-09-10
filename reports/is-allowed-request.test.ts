import { isAllowedRequest } from './is-allowed-request';

describe.skip('is-allowed-request', () => {
  it('returns true if request does not start with POST', () => {
    const result = isAllowedRequest('GET / HTTP/1.1');

    expect(result).toBe(true);
  });

  it('returns true if POST, and path is whitelisted', () => {
    const result = isAllowedRequest('POST /follow HTTP/1.1');

    expect(result).toBe(true);
  });

  it('returns false if POST, and path is not whitelisted', () => {
    const result = isAllowedRequest('POST /foo HTTP/1.1');

    expect(result).toBe(false);
  });

  it('returns false if POST, and request is malformed', () => {
    const result = isAllowedRequest('POST +bar');

    expect(result).toBe(false);
  });
});
