import { shouldBeLogged } from '../../src/shared-ports/log-level';

describe('log-level', () => {
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
});
