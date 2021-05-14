/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable jest/no-export */

namespace A {
  export type A = {
    readonly _type: 'A',
    readonly value: string,
  };

  export const fromString = (s: string): A => ({
    _type: 'A',
    value: s,
  });

  export const isA = (x: unknown): x is A => {
    if (typeof x === 'object' && x !== null && '_type' in x) {
      return (x as A)._type === 'A';
    }
    return false;
  };
}

namespace B {
  export type Bid = {
    readonly _type: 'B',
    readonly value: string,
  };

  export const fromString = (s: string): Bid => ({
    _type: 'B',
    value: s,
  });
}

describe('id-options', () => {
  describe('tagged value', () => {
    const a: A.A = A.fromString('a');
    const b: B.Bid = B.fromString('b');

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
