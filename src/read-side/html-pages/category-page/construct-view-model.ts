import * as TE from 'fp-ts/TaskEither';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../../types/data-error';

export const constructViewModel = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => TE.right({
  pageHeading: `${params.title}`,
  categoryContent: undefined,
});
