import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarPorts } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../shared-read-models';
import { ViewModel } from '../view-model';

export type Dependencies = Queries & ConstructListCardViewModelWithAvatarPorts;

export const constructViewModel = (dependencies: Dependencies): ViewModel => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithAvatar(dependencies)),
);
