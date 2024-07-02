import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import { ViewModel } from './view-model';
import { ConstructViewModel } from '../construct-view-model';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.fetchByCategory(params.categoryName),
  TE.chainTaskK(constructArticleCardStackWithSilentFailures(dependencies)),
  TE.map((articleCardViewModel) => ({
    pageHeading: `${params.categoryName}`,
    categoryContent: articleCardViewModel,
  })),
);
