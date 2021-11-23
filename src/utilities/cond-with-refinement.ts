import { Predicate } from 'fp-ts/Predicate';
import { Refinement } from 'fp-ts/Refinement';

type Case<A, B extends A, C> = ([
    refinement: Refinement<A, B>,
    predicate: Predicate<B>,
    action: (b: B) => C,
]);

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
