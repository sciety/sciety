import { isAllowedRequest } from './is-allowed-request';

describe('is-allowed-request', () => {
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

  it.each([
    ['POST +bar'],
    ['POST /follow foo'],
  ])('returns false if POST, and request (%s) is malformed', (input) => {
    const result = isAllowedRequest(input);

    expect(result).toBe(false);
  });
});
