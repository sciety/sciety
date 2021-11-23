import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Refinement';

export const refineAndPredicate = <A, B extends A>(refinement: R.Refinement<A, B>, predicate: P.Predicate<B>) => (
  input: A,
): input is B => refinement(input) && predicate(input);
