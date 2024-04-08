import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toPageOfCards } from './to-page-of-cards';
import { paginate } from '../../shared-components/pagination';
import * as DE from '../../../types/data-error';
import { ContentWithPaginationViewModel } from '../view-model';
import { ListId } from '../../../types/list-id';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';

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
      ...constructPaginationControlsViewModel(pageOfArticles.nextPage, `/lists/${listId}`),
    })),
  )),
);
