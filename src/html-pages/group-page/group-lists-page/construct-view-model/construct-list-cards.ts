import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { ListCardViewModel } from '../../../../shared-components/list-card/render-list-card';
import { SelectAllListsOwnedBy } from '../../../../shared-ports';
import { Group } from '../../../../types/group';
import { List } from '../../../../types/list';
import * as LOID from '../../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';

export type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const toListCardViewModel = (list: List): ListCardViewModel => ({
  ...list,
  listId: list.id,
  title: list.name,
  articleCount: list.articleIds.length,
  updatedAt: O.some(list.updatedAt),
  avatarUrl: O.none,
});

export const constructListCards = (ports: Ports, group: Group): ReadonlyArray<ListCardViewModel> => pipe(
  group.id,
  LOID.fromGroupId,
  ports.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map(toListCardViewModel),
);
