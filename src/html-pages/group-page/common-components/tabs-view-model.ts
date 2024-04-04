import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Group } from '../../../types/group';
import * as LOID from '../../../types/list-owner-id';
import { Queries } from '../../../read-models';

export type TabsViewModel = {
  groupSlug: string,
  listCount: number,
};

export type Dependencies = Pick<Queries, 'getFollowers' | 'selectAllListsOwnedBy'>;

export const constructTabsViewModel = (dependencies: Dependencies, group: Group): TabsViewModel => ({
  groupSlug: group.slug,
  listCount: pipe(
    group.id,
    LOID.fromGroupId,
    dependencies.selectAllListsOwnedBy,
    RA.size,
  ),
});
