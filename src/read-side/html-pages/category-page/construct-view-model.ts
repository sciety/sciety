import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../../types/data-error';
import * as EDOI from '../../../types/expression-doi';
import { constructArticleCardStackWithSilentFailures } from '../shared-components/article-list';

export const constructViewModel = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  [EDOI.fromValidatedString('10.1101/2024.01.16.575490')],
  constructArticleCardStackWithSilentFailures(dependencies),
  T.map((articleCardViewModel) => ({
    pageHeading: `${params.title}`,
    categoryContent: articleCardViewModel,
  })),
  TE.rightTask,
);
