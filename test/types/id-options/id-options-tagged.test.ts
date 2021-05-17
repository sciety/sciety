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
      expect(A.eqA.equals(a, a)).toBe(true);
      expect(A.eqA.equals(a, A.fromString('a'))).toBe(true);
      expect(A.eqA.equals(a, A.fromString('b'))).toBe(false);
      expect(A.eqA.equals(a, b)).toBe(false); //                    compiler error
    });

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
