import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toPageOfCards } from './to-page-of-cards';
import * as DE from '../../../types/data-error';
import { ExpressionDoi } from '../../../types/expression-doi';
import { ListId } from '../../../types/list-id';
import { paginate } from '../../shared-components/pagination';
import { ContentWithPaginationViewModel } from '../view-model';

const constructPaginationControlsViewModel = (nextPageNumber: O.Option<number>, basePath: string) => ({
  nextPageHref: pipe(
    nextPageNumber,
    O.map(
      (nextPage) => `${basePath}?page=${nextPage}`,
    ),
  ),
});

export const constructContentWithPaginationViewModel = (
  dependencies: Dependencies,
  pageNumber: number,
  editCapability: boolean,
  listId: ListId,
) => (articleIds: ReadonlyArray<ExpressionDoi>): TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentWithPaginationViewModel> => pipe(
  articleIds,
  paginate(20, pageNumber),
  TE.fromEither,
  TE.chainW((pageOfArticles) => pipe(
    pageOfArticles,
    toPageOfCards(dependencies, editCapability, listId),
    TE.map((articles) => ({
      articles,
      pagination: pageOfArticles,
      ...constructPaginationControlsViewModel(pageOfArticles.forwardPage, `/lists/${listId}`),
    })),
  )),
);
