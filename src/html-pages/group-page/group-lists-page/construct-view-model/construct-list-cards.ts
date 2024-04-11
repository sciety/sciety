import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithoutCurator, ListCardViewModel } from '../../../../shared-components/list-card';
import { Group } from '../../../../types/group';
import * as LOID from '../../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { Dependencies } from './dependencies';

export const constructListCards = (dependencies: Dependencies, group: Group): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithoutCurator),
);
