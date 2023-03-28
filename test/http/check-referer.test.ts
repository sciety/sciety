import { checkReferer } from '../../src/http/check-referer';

describe('check-referer', () => {
  describe('when a referer is not provided', () => {
    it('defaults to homepage', () => {
      expect(checkReferer(undefined)).toBe('/');
    });
  });

  describe('when a referer is provided', () => {
    describe('and it matches the application hostname', () => {
      it('uses the provided referer', () => {
        expect(checkReferer('https://sciety.org/sciety-feed')).toBe('https://sciety.org/sciety-feed');
      });
    });

    describe('and it does not match the application hostname', () => {
      it('defaults to the homepage', () => {
        expect(checkReferer('https://t.co/j2ZLHZRBXb')).toBe('/');
      });
    });
  });
});
