import * as UI from '../../../src/write-side/resources/update-idempotency';

describe('update-idempotency', () => {
  describe('isEmpty', () => {
    it.each([
      [{}, true],
      [{ a: undefined }, true],
      [{ foo: 'bar' }, false],
    ])('given %s returns %s', (input, expected) => {
      expect(UI.isEmpty(input)).toBe(expected);
    });
  });

  describe('changedFields', () => {
    it.each([
      // trivial
      [{ id: 'foo' }, {}, {}],
      [{ id: 'foo', a: 1 }, { a: 1 }, { a: undefined }],
      // involving objects
      [{ id: 'foo', a: ['1'] }, { a: ['1'] }, { a: undefined }],
      [{ id: 'foo', a: ['2'] }, { a: ['1'] }, { a: ['2'] }],
      // combinations of changed and unchanged
      [{ id: 'foo', a: 1, b: 2 }, { a: 1, b: 1 }, { a: undefined, b: 2 }],
      // combinations of changed and undefined
      [{ id: 'foo', a: undefined, b: 2 }, { a: 1, b: 1 }, { a: undefined, b: 2 }],
      [{ id: 'foo', a: undefined, b: 2 }, { a: undefined, b: 1 }, { a: undefined, b: 2 }],
      [{ id: 'foo', a: 1, b: 2 }, { a: undefined, b: 1 }, { a: 1, b: 2 }],
    ])('input: %s and state: %s returns %s', (input, state, expected) => {
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(UI.changedFields(input, 'id')(state)).toEqual(expected);
    });
  });
});
