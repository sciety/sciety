import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { ConstructViewModel } from '../../construct-view-model';
import { Params } from '../params';
import { ViewModel } from '../view-model';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
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
