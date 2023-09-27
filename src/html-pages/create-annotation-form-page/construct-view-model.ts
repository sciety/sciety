import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';
import { ExternalQueries } from '../../third-parties/external-queries';
import { ViewModel } from './view-model';
import { DataError } from '../../types/data-error';

export type Dependencies = Queries & ExternalQueries;

export const constructViewModel = (
  articleId: string,
  listId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
): TE.TaskEither<DataError, ViewModel> => pipe(
  {
    articleId,
    listId,
  },
  TE.right,
);
