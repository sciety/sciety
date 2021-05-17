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
    });

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
