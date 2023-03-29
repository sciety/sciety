import { defaultDestination, calculateAuthenticationDestination } from '../../../src/http/authentication-destination/calculate-authentication-destination';

describe('calculate-authentication-destination', () => {
  describe('when a referer is not provided', () => {
    it('defaults to homepage', () => {
      expect(calculateAuthenticationDestination(undefined, 'sciety.org')).toBe(defaultDestination);
    });
  });

  describe('when a referer is provided', () => {
    describe('and it matches the application hostname', () => {
      it('uses the provided referer', () => {
        expect(calculateAuthenticationDestination('https://sciety.org/sciety-feed', 'sciety.org')).toBe('https://sciety.org/sciety-feed');
      });
    });

    describe('and it does not match the application hostname', () => {
      it('defaults to the homepage', () => {
        expect(calculateAuthenticationDestination('https://t.co/j2ZLHZRBXb', 'sciety.org')).toBe(defaultDestination);
      });
    });
  });
});
