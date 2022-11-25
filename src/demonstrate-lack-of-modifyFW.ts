import { expectTypeOf } from 'expect-type';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { modifyF, modifyW } from 'spectacles-ts';

type PageOfItems<I> = {
  items: ReadonlyArray<I>,
  pageNumber: number,
};

declare const pageOfNumbers: PageOfItems<number>;

const mapToString = (numbers: ReadonlyArray<number>) => numbers.map((n) => String(n));

//
// modify with A => B works
//

expectTypeOf(
  pipe(
    pageOfNumbers,
    modifyW('items', mapToString),
  ),
).toMatchTypeOf<PageOfItems<string>>();

//
// A => HKT<F, A> works
//

expectTypeOf(
  pipe(
    pageOfNumbers,
    modifyF(T.ApplicativePar)('items', T.of),
  ),
).toMatchTypeOf<T.Task<PageOfItems<number>>>();

//
// A => HKT<F, B> not possible
//

expectTypeOf(
  pipe(
    pageOfNumbers,
    modifyF(T.ApplicativePar)('items', flow(mapToString, T.of)),
  ),
).toMatchTypeOf<T.Task<PageOfItems<string>>>();
