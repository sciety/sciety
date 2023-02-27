import { Tab } from '../../../shared-components/tabs';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Group } from '../../../types/group';

export type TabListViewModel = {
  group: Group,
  lists: ReadonlyArray<unknown>,
  followers: ReadonlyArray<unknown>,
};

export const tabList = (viewmodel: TabListViewModel): [Tab, Tab, Tab] => [
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${viewmodel.lists.length} </span>Lists<span aria-hidden="true"> (${viewmodel.lists.length})</span>`),
    url: `/groups/${viewmodel.group.slug}/lists`,
  },
  {
    label: toHtmlFragment('About'),
    url: `/groups/${viewmodel.group.slug}/about`,
  },
  {
    label: toHtmlFragment(`<span class="visually-hidden">This group has ${viewmodel.followers.length} </span>Followers<span aria-hidden="true"> (${viewmodel.followers.length})</span>`),
    url: `/groups/${viewmodel.group.slug}/followers`,
  },
];
