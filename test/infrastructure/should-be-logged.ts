import { shouldBeLogged } from '../../src/infrastructure/logger/should-be-logged';

describe('should-be-logged', () => {
  describe('when configured level is info and the requested level is debug', () => {
    it('is not logged', () => {
      expect(shouldBeLogged('debug', 'info')).toBe(false);
    });
  });

  describe('when configured level is verbose and the requested level is error', () => {
    it('is logged', () => {
      expect(shouldBeLogged('error', 'verbose')).toBe(true);
    });
  });

  describe('when configured level is warn and the requested level is warn', () => {
    it('is logged', () => {
      expect(shouldBeLogged('warn', 'warn')).toBe(true);
    });
  });
});
