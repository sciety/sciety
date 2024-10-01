import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructPaginationControls } from './construct-pagination-controls';
import { Params } from './params';
import { ViewModel } from './view-model';
import { ConstructViewModel } from '../construct-view-model';
import { constructArticleCard } from '../shared-components/article-card';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.fetchByCategory(params.categoryName),
  TE.bindW('articleCardViewModels', ({ expressionDois }) => pipe(
    expressionDois,
    T.traverseArray(constructArticleCard(dependencies)),
    TE.rightTask,
  )),
  TE.map(({ articleCardViewModels, totalItems }) => ({
    pageHeading: `${params.categoryName}`,
    content: pipe(
      totalItems,
      E.fromPredicate(
        (items) => items > 0,
        () => 'No evaluated articles were found for this category.',
      ),
      E.map(() => ({
        categoryContent: articleCardViewModels,
        paginationControls: constructPaginationControls(10, params, totalItems),
      })),
    ),
  })),
);
