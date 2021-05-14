/* eslint-disable max-classes-per-file */

describe('id-options', () => {
  describe('class', () => {
    class A {
    }

    const isA = (x: unknown) => x instanceof A;

    class B {
    }

    const a: A = new A();
    const b: B = new B();

    it('runtime discrimination', () => {
      expect(isA(a)).toBe(true);
      expect(isA(b)).toBe(false);
    });

    it.todo('equality');

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
