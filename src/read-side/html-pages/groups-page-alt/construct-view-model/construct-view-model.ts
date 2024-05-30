import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as DE from '../../../../types/data-error';
import { GroupCardViewModel } from '../../shared-components/group-card';
import { toListOfGroupCardViewModels } from '../to-list-of-group-card-view-models';

export type ViewModel = {
  groupCards: ReadonlyArray<GroupCardViewModel>,
};

export const constructViewModel = (
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  dependencies.getAllGroups(),
  toListOfGroupCardViewModels(dependencies),
  TE.map((groupCards) => ({ groupCards })),
);
