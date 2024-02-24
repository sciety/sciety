import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarDependencies } from '../../../shared-components/list-card/index.js';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering.js';
import { Queries } from '../../../read-models/index.js';
import { ViewModel } from '../view-model.js';

export type Dependencies = Queries & ConstructListCardViewModelWithAvatarDependencies;

export const constructViewModel = (dependencies: Dependencies): ViewModel => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithAvatar(dependencies)),
);
