import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { constructListCardViewModelWithoutAvatar } from '../../../../shared-components/list-card';
import { ListCardViewModel } from '../../../../shared-components/list-card/render-list-card';
import { Group } from '../../../../types/group';
import * as LOID from '../../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { Queries } from '../../../../shared-read-models';

export type Ports = Pick<Queries, 'selectAllListsOwnedBy'>;

export const constructListCards = (ports: Ports, group: Group): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  ports.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(constructListCardViewModelWithoutAvatar),
);
