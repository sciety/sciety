import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';

export type Dependencies = Queries;

export type ViewModel = {
  pageHeading: string,
};

export const constructViewModel = (dependencies: Dependencies) => (groupSlug: string): E.Either<'no-such-group', ViewModel> => pipe(
  groupSlug,
  dependencies.getGroupBySlug,
  E.fromOption(() => 'no-such-group' as const),
  E.map((group) => ({
    pageHeading: `Add a featured list form for a ${group.name}`,
  })),
);
