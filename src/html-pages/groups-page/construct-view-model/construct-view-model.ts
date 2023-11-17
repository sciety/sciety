import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models';
import * as DE from '../../../types/data-error';
import { GroupCardViewModel } from '../../../shared-components/group-card';
import { Dependencies } from './dependencies';

export const constructViewModel = (
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>> => pipe(
  dependencies.getAllGroups(),
  toListOfGroupCardViewModels(dependencies),
);
