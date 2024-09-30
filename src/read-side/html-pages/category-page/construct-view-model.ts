import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import { ViewModel } from './view-model';
import { constructCategoryPageHref } from '../../../standards/paths';
import { ConstructViewModel } from '../construct-view-model';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

const constructPaginationControls = (pageSize: number, totalItems: number, categoryName: string): ViewModel['paginationControls'] => ({
  backwardPageHref: O.some('/backward-page-href'),
  forwardPageHref: O.some(constructCategoryPageHref(categoryName, 2)),
  page: 1,
  pageCount: Math.ceil(totalItems / pageSize),
});

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
    paginationControls: constructPaginationControls(10, totalItems, params.categoryName),
  })),
);
