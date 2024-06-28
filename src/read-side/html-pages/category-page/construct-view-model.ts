import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import { fetchByCategory } from '../../../third-parties/fetch-search-categories';
import * as DE from '../../../types/data-error';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

export const constructViewModel = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  fetchByCategory(),
  constructArticleCardStackWithSilentFailures(dependencies),
  T.map((articleCardViewModel) => ({
    pageHeading: `${params.title}`,
    categoryContent: articleCardViewModel,
  })),
  TE.rightTask,
);
