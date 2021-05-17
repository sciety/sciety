/* eslint-disable jest-formatting/padding-around-all */
/* eslint-disable eqeqeq */
import * as A from './a-branded';
import * as B from './b-branded';

describe('id-options', () => {
  describe('prefixed branded string', () => {
    const a: A.A = A.fromString('a');
    const b: B.B = B.fromString('b');

    it('runtime discrimination', () => {
      expect(A.isA(a)).toBe(true);
      expect(A.isA(b)).toBe(false);
    });

    it('equality', () => {
      expect(a === b).toBe(false); //                               compiler error
      expect(a.toString() === b.toString()).toBe(false);
      expect(a === A.fromString('a')).toBe(true);
      expect(a === A.fromString('x')).toBe(false);
      expect(a === B.fromString('a')).toBe(false);
      expect(a == A.fromString('a')).toBe(true);
      expect(a == A.fromString('x')).toBe(false);
      expect(a == B.fromString('a')).toBe(false);
    });

    it('use in Map keys', () => {
      const map = new Map<A.A, B.B>();
      map.set(a, b);

      expect(map.get(a)).toBe(b);
      expect(map.get(a)).toStrictEqual(b);
      expect(map.get(A.fromString('a'))).toBe(b);

      expect(map.has(a)).toBe(true);
      expect(map.has(A.fromString('a'))).toBe(true);

      expect(map.size).toBe(1);
      map.set(a, B.fromString('b2'));
      expect(map.size).toBe(1);

      map.set(A.fromString('a'), b);
      expect(map.size).toBe(1);
    });

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
