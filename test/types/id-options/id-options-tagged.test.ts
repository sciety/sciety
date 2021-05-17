/* eslint-disable jest-formatting/padding-around-all */
/* eslint-disable eqeqeq */
import * as A from './a-tagged';
import * as B from './b-tagged';

describe('id-options', () => {
  describe('tagged value', () => {
    const a: A.A = A.fromString('a');
    const b: B.B = B.fromString('b');

    it('runtime discrimination', () => {
      expect(A.isA(a)).toBe(true);
      expect(A.isA(b)).toBe(false);
    });

    it('equality', () => {
      expect(a === b).toBe(false); //                               compiler error
      expect(a.toString() === b.toString()).toBe(true); //          !!
      expect(a === A.fromString('a')).toBe(false); //               :-(
      expect(a === A.fromString('x')).toBe(false);
      expect(a === B.fromString('a')).toBe(false);
      expect(a == A.fromString('a')).toBe(false); //               :-(
      expect(a == A.fromString('x')).toBe(false);
      expect(a == B.fromString('a')).toBe(false);
      expect(A.eqA.equals(a, a)).toBe(true);
      expect(A.eqA.equals(a, A.fromString('a'))).toBe(true);
      expect(A.eqA.equals(a, A.fromString('b'))).toBe(false);
      expect(A.eqA.equals(a, b)).toBe(false); //                    compiler error
    });

    it('use in Map keys', () => {
      const map = new Map<A.A, B.B>();
      map.set(a, b);

      expect(map.get(a)).toBe(b);
      expect(map.get(a)).toStrictEqual(b);
      expect(map.get(A.fromString('a'))).toBeUndefined(); //        :-(

      expect(map.has(a)).toBe(true);
      expect(map.has(A.fromString('a'))).toBe(false); //            :-(

      expect(map.size).toBe(1);
      map.set(a, B.fromString('b2'));
      expect(map.size).toBe(1);

      map.set(A.fromString('a'), b);
      expect(map.size).toBe(2); //                                  :-(
    });

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
