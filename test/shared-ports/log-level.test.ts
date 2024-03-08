import { shouldLogLineBeIgnored } from '../../src/shared-ports/log-level';

describe('log-level', () => {
  describe('when requested level is debug and the configured level is info', () => {
    it('gets ignored', () => {
      expect(shouldLogLineBeIgnored('debug', 'info')).toBe(true);
    });
  });

  describe('when requested level is error and the configured level is verbose', () => {
    it('does not get ignored', () => {
      expect(shouldLogLineBeIgnored('error', 'verbose')).toBe(false);
    });
  });
});
