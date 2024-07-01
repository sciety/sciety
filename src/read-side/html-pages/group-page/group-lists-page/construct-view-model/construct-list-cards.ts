import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Group } from '../../../../../types/group';
import * as LOID from '../../../../../types/list-owner-id';
import { DependenciesForViews } from '../../../../dependencies-for-views';
import { constructListCardViewModelWithoutCurator, ListCardViewModel } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';

export const constructListCards = (
  dependencies: DependenciesForViews, group: Group,
): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithoutCurator),
);
