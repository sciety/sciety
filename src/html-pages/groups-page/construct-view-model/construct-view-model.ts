import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models.js';
import * as DE from '../../../types/data-error.js';
import { GroupCardViewModel } from '../../../shared-components/group-card/index.js';
import { Queries } from '../../../read-models/index.js';

export const constructViewModel = (
  queries: Queries,
): TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>> => pipe(
  queries.getAllGroups(),
  toListOfGroupCardViewModels(queries),
);
