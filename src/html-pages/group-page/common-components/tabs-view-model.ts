import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { SelectAllListsOwnedBy } from '../../../shared-ports';
import { Group } from '../../../types/group';
import * as LOID from '../../../types/list-owner-id';
import { Queries } from '../../../shared-read-models';

export type TabsViewModel = {
  groupSlug: string,
  listCount: number,
  followerCount: number,
};

export type Ports = {
  getFollowers: Queries['getFollowers'],
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const constructTabsViewModel = (ports: Ports, group: Group): TabsViewModel => ({
  groupSlug: group.slug,
  listCount: pipe(
    group.id,
    LOID.fromGroupId,
    ports.selectAllListsOwnedBy,
    RA.size,
  ),
  followerCount: pipe(
    ports.getFollowers(group.id),
    RA.size,
  ),
});
