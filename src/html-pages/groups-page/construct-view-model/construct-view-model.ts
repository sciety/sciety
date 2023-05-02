import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models';
import * as DE from '../../../types/data-error';
import { GroupCardViewModel } from '../../../shared-components/group-card';
import { Queries } from '../../../shared-read-models';

export const constructViewModel = (
  queries: Queries,
): TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>> => pipe(
  queries.getAllGroups(),
  toListOfGroupCardViewModels(queries),
);
