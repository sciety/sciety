import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Refinement';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GuardedType<T> = T extends (x: any) => x is infer U ? U : never;

export const refineAndPredicate = <A, B extends A>(refinement: R.Refinement<A, B>, predicate: P.Predicate<B>) => (
  input: A,
): input is B => refinement(input) && predicate(input);

export function condWithRefinement<A, B1 extends A, C>(
  otherwise: (a: A) => C,
  cases: Readonly<[Case<A, B1, C>]>,
): (input: A) => C;
export function condWithRefinement<A, B1 extends A, B2 extends A, C>(
  otherwise: (a: A) => C,
  cases: Readonly<[Case<A, B1, C>, Case<A, B2, C>]>,
): (input: A) => C;
export function condWithRefinement<A, B1 extends A, B2 extends A, B3 extends A, C>(
  otherwise: (a: A) => C,
  cases: Readonly<[Case<A, B1, C>, Case<A, B2, C>, Case<A, B3, C>]>,
): (input: A) => C;
export function condWithRefinement<A, B extends A, C>(
  otherwise: (a: A) => C,
  cases: ReadonlyArray<Case<A, B, C>>,
) {
  return (input: A): C => {
    // eslint-disable-next-line no-loops/no-loops
    for (const [refinement, predicate, action] of cases) {
      if (refinement(input) && predicate(input)) {
        return action(input);
      }
    }
    return otherwise(input);
  };
}

type Case<A, B extends A, C> = ([
    refinement: Refinement<A, B>,
    predicate: Predicate<B>,
    action: (b: B) => C,
]);

type Predicate<A> = {
  (a: A): boolean,
};

type Refinement<A, B extends A> = {
  (a: A): a is B,
};
