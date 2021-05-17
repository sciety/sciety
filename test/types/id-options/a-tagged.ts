import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

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

export const eqA: Eq.Eq<A> = pipe(
  S.Eq,
  Eq.contramap((id) => id.value),
);
