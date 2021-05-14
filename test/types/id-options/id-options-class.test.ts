/* eslint-disable max-classes-per-file */
import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

describe('id-options', () => {
  describe('class', () => {
    class A {
      private readonly value: string;

      public static eqA: Eq.Eq<A> = pipe(S.Eq, Eq.contramap((a) => a.toString()));

      constructor(x: string) {
        this.value = x;
      }

      toString(): string {
        return this.value;
      }
    }

    const isA = (x: unknown) => x instanceof A;

    class B {
      private readonly value: string;

      constructor(x: string) {
        this.value = x;
      }

      toString(): string {
        return this.value;
      }
    }

    const a: A = new A('a');
    const b: B = new B('b');

    it('runtime discrimination', () => {
      expect(isA(a)).toBe(true);
      expect(isA(b)).toBe(false);
    });

    it('equality', () => {
      expect(a === b).toBe(false); //                               compiler error
      expect(a.toString() === b.toString()).toBe(false);
      expect(a === new A('a')).toBe(false);
      expect(A.eqA.equals(a, a)).toBe(true);
      expect(A.eqA.equals(a, new A('a'))).toBe(true);
      expect(A.eqA.equals(a, new A('b'))).toBe(false);
      expect(A.eqA.equals(a, b)).toBe(false); //                    compiler error
    });

    it.todo('use in Map keys');

    it.todo('use in Set');

    it.todo('performance');

    it.todo('serialization / deserialization');
  });
});
