import * as UI from '../../../src/write-side/resources/update-idempotency';

describe('update-idempotency', () => {
  describe('isEmpty', () => {
    it.each([
      [{}, true],
      [{ foo: 'bar' }, false],
    ])('given %s returns %s', (input, expected) => {
      expect(UI.isEmpty(input)).toBe(expected);
    });
  });
});
