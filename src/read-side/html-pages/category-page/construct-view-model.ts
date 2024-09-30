import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import { ViewModel } from './view-model';
import { ConstructViewModel } from '../construct-view-model';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

const constructPaginationControls = () => ({
  backwardPageHref: O.some('/backward-page-href'),
  forwardPageHref: O.some('/forward-page-href'),
  page: 1,
  pageCount: 100,
});

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.fetchByCategory(params.categoryName),
  TE.map((expressionDois) => ({
    expressionDois,
    totalItems: 1000,
  })),
  TE.chainTaskK(({ expressionDois, totalItems }) => pipe(
    expressionDois,
    constructArticleCardStackWithSilentFailures(dependencies),
    T.map((articleCardViewModels) => ({
      articleCardViewModels,
      totalItems,
    })),
  )),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TE.map(({ articleCardViewModels, totalItems }) => ({
    pageHeading: `${params.categoryName}`,
    categoryContent: articleCardViewModels,
    paginationControls: constructPaginationControls(),
  })),
);
