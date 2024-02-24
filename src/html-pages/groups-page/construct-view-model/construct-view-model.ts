import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models.js';
import * as DE from '../../../types/data-error.js';
import { GroupCardViewModel } from '../../../shared-components/group-card/index.js';
import { Dependencies } from './dependencies.js';

export const constructViewModel = (
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>> => pipe(
  dependencies.getAllGroups(),
  toListOfGroupCardViewModels(dependencies),
);
