import { Tab } from '../../../shared-components/tabs';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Group } from '../../../types/group';
import { TabsViewModel } from './tabs-view-model';

export type TabListViewModel = {
  group: Group,
  lists: ReadonlyArray<unknown>,
  followers: ReadonlyArray<unknown>,
};

export const tabList = (viewmodel: TabsViewModel): [Tab, Tab, Tab] => [
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${viewmodel.listCount} </span>Lists<span aria-hidden="true"> (${viewmodel.listCount})</span>`),
    url: `/groups/${viewmodel.groupSlug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${viewmodel.groupSlug}/about`,
  },
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${viewmodel.followerCount} </span>Followers<span aria-hidden="true"> (${viewmodel.followerCount})</span>`),
    url: `/groups/${viewmodel.groupSlug}/followers`,
  },
];
