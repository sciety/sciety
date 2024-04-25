import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { sortByDefaultListOrdering } from '../../../../../html-pages/sort-by-default-list-ordering';
import { Group } from '../../../../../types/group';
import * as LOID from '../../../../../types/list-owner-id';
import { constructListCardViewModelWithoutCurator, ListCardViewModel } from '../../../shared-components/list-card';

export const constructListCards = (dependencies: Dependencies, group: Group): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithoutCurator),
);
