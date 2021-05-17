import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

export class A {
  private readonly value: string;

  public static fromString = (s: string): A => new A(s);

  public static isA = (x: unknown): boolean => x instanceof A;

  public static eqA: Eq.Eq<A> = pipe(S.Eq, Eq.contramap((a) => a.toString()));

  private constructor(x: string) {
    this.value = x;
  }

  toString(): string {
    return this.value;
  }
}
