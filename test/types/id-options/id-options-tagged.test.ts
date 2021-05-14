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

    it.todo('equality');

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
