import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

export class B {
  private readonly value: string;

  public static fromString = (s: string): B => new B(s);

  public static isB = (x: unknown): boolean => x instanceof B;

  public static eqB: Eq.Eq<B> = pipe(S.Eq, Eq.contramap((a) => a.toString()));

  private constructor(x: string) {
    this.value = x;
  }

  toString(): string {
    return this.value;
  }
}
