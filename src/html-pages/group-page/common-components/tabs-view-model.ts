import { Group } from '../../../types/group';
import { Queries } from '../../../read-models';

export type TabsViewModel = {
  groupSlug: string,
};

export type Dependencies = Pick<Queries, 'getFollowers' | 'selectAllListsOwnedBy'>;

export const constructTabsViewModel = (dependencies: Dependencies, group: Group): TabsViewModel => ({
  groupSlug: group.slug,
});
