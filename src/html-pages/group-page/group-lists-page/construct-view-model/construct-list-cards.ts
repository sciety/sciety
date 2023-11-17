import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithoutAvatar } from '../../../../shared-components/list-card/index.js';
import { ListCardViewModel } from '../../../../shared-components/list-card/render-list-card.js';
import { Group } from '../../../../types/group.js';
import * as LOID from '../../../../types/list-owner-id.js';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering.js';
import { Dependencies } from './dependencies.js';

export const constructListCards = (dependencies: Dependencies, group: Group): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithoutAvatar),
);
