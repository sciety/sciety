import { Functor, Functor1, Functor2 } from 'fp-ts/Functor';
import {
  HKT, Kind, Kind2, URIS, URIS2,
} from 'fp-ts/HKT';
import { pipe } from 'fp-ts/function';

export function updateWithF<F extends URIS2>(FA: Functor2<F>):
<AS, B, E>(mod: (as: AS) => Kind2<F, E, B>)
=> <A extends AS>(a: A)
=> Kind2<F, E, A & B>;
export function updateWithF<F extends URIS>(FA: Functor1<F>):
<AS, B>(mod: (as: AS) => Kind<F, B>)
=> <A extends AS>(a: A)
=> Kind<F, A & B>;
export function updateWithF<F>(FA: Functor<F>):
<AS, B>(mod: (as: AS) => HKT<F, B>)
=> <A extends AS>(a: A)
=> HKT<F, A & B>;

export function updateWithF<F>(FA: Functor<F>):
<AS, B>(f: (as: AS) => HKT<F, B>)
=> <A extends AS>(a: A)
=> HKT<F, A & B> {
  return (mod) => (a) => pipe(
    a,
    mod,
    (fb) => FA.map(fb, (b) => ({
      ...a,
      ...b,
    })),
  );
}

type UpdateWith = <AS, B>(f: (as: AS) => B) => <A extends AS>(a: A) => A & B;

// ts-unused-exports:disable-next-line
export const updateWith: UpdateWith = (f) => (a) => {
  const b = f(a);
  return { ...a, ...b };
};
