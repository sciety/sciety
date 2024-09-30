import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructPaginationControls } from './construct-pagination-controls';
import { Params } from './params';
import { ViewModel } from './view-model';
import { ConstructViewModel } from '../construct-view-model';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.fetchByCategory(params.categoryName),
  TE.bindW('articleCardViewModels', ({ expressionDois }) => pipe(
    expressionDois,
    constructArticleCardStackWithSilentFailures(dependencies),
    TE.rightTask,
  )),
  TE.map(({ articleCardViewModels, totalItems }) => ({
    pageHeading: `${params.categoryName}`,
    categoryContent: articleCardViewModels,
    paginationControls: constructPaginationControls(10, params, totalItems),
  })),
);
