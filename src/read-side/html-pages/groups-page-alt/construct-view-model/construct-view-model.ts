import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toListOfGroupCardViewModels } from './to-list-of-group-card-view-models';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';

export const constructViewModel = (
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  dependencies.getAllGroups(),
  toListOfGroupCardViewModels(dependencies),
  TE.map((groupCards) => ({
    title: 'Groups',
    groupCards,
  })),
);
