import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toPageOfCards } from './to-page-of-cards';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { ContentWithPaginationViewModel } from '../view-model';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';

export const constructContentWithPaginationViewModel = (
  dependencies: Dependencies,
  pageNumber: number,
  listId: ListId,
) => (articleIds: ReadonlyArray<Doi>): TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentWithPaginationViewModel> => pipe(
  articleIds,
  RA.takeLeft(20),
  RA.map(dependencies.getActivityForDoi),
  TE.right,
  TE.chainW((activities) => pipe(
    activities,
    toPageOfCards(dependencies, listId),
    TE.map((articles) => ({ articles, pagination: activities })),
  )),
);
