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

    it.todo('equality');

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
