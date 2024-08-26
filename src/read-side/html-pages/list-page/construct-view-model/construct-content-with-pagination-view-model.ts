import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toPageOfCards } from './to-page-of-cards';
import * as DE from '../../../../types/data-error';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { ListId } from '../../../../types/list-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
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
  dependencies: DependenciesForViews,
  pageNumber: number,
  editCapability: boolean,
  listId: ListId,
) => (expressionDoi: ReadonlyArray<ExpressionDoi>): TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ContentWithPaginationViewModel> => pipe(
  expressionDoi,
  paginate(20, pageNumber),
  TE.fromEither,
  TE.chainW((pageOfExpressionDois) => pipe(
    pageOfExpressionDois,
    toPageOfCards(dependencies, editCapability, listId),
    TE.map((articles) => ({
      articles,
      pagination: pageOfExpressionDois,
      ...constructPaginationControlsViewModel(pageOfExpressionDois.forwardPage, `/lists/${listId}`),
    })),
  )),
);
