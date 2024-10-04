import * as TE from 'fp-ts/TaskEither';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

export const constructViewModel = (): TE.TaskEither<DE.DataError, ViewModel> => TE.right({
  pageHeading: 'Search evaluated preprints',
});
