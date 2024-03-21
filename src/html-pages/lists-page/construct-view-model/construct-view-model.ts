import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarDependencies } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../read-models';
import { ViewModel } from '../view-model';

export type Dependencies = Queries & ConstructListCardViewModelWithAvatarDependencies;

export const constructViewModel = (dependencies: Dependencies): ViewModel => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithAvatar(dependencies)),
  (listCards) => ({
    listCards,
    pagination: {
      backwardPageHref: O.none,
      forwardPageHref: O.none,
      page: 1,
      pageCount: 1,
    },
  }),
);
