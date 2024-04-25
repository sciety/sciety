import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { GroupCardViewModel } from '../../../../shared-components/group-card';
import * as DE from '../../../../types/data-error';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models';

export const constructViewModel = (
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>> => pipe(
  dependencies.getAllGroups(),
  toListOfGroupCardViewModels(dependencies),
);
