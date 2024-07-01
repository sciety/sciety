import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { Params } from '../params';
import { ViewModel } from '../view-model';

type ConstructViewModel = (dependencies: DependenciesForViews)
=> (params: Params)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params.listId,
  dependencies.lookupList,
  TE.fromOption(() => DE.notFound),
  TE.map((list) => ({
    listId: list.id,
    listName: list.name,
    listHref: `/lists/${list.id}`,
    pageHeading: `Subscribe to ${list.name}`,
  })),
);
