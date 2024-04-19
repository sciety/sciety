import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';

export type Dependencies = Queries;

export type ViewModel = {
  groupName: string,
};

export const constructViewModel = (dependencies: Dependencies): E.Either<'no-such-group', ViewModel> => pipe(
  'prereview',
  dependencies.getGroupBySlug,
  E.fromOption(() => 'no-such-group' as const),
  E.map((group) => ({
    groupName: group.name,
  })),
);
