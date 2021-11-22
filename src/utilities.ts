import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Refinement';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

export const refineAndPredicate = <A, B extends A>(refinement: R.Refinement<A, B>, predicate: P.Predicate<B>) => (
  input: A,
): input is B => refinement(input) && predicate(input);
