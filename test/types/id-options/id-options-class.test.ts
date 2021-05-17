/* eslint-disable max-classes-per-file */
import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

describe('id-options', () => {
  describe('class', () => {
    class A {
      private readonly value: string;

      public static fromString = (s: string) => new A(s);

      public static isA = (x: unknown) => x instanceof A;

      public static eqA: Eq.Eq<A> = pipe(S.Eq, Eq.contramap((a) => a.toString()));

      private constructor(x: string) {
        this.value = x;
      }

      toString(): string {
        return this.value;
      }
    }

    class B {
      private readonly value: string;

      public static fromString = (s: string) => new B(s);

      private constructor(x: string) {
        this.value = x;
      }

      toString(): string {
        return this.value;
      }
    }

    const a: A = A.fromString('a');
    const b: B = B.fromString('b');

    it('runtime discrimination', () => {
      expect(A.isA(a)).toBe(true);
      expect(A.isA(b)).toBe(false);
    });

    it('equality', () => {
      expect(a === b).toBe(false); //                               compiler error
      expect(a.toString() === b.toString()).toBe(false);
      expect(a === A.fromString('a')).toBe(false);
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
