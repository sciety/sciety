import * as TE from 'fp-ts/TaskEither';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../../types/data-error';

export const constructViewModel = (params: Params): TE.TaskEither<DE.DataError, ViewModel> => TE.right({
  pageHeading: `${params.title}`,
  categoryContent: undefined,
});
