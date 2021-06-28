import { Tab } from '../shared-components/tabs';
import { toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export const tabList = (userId: UserId, savedArticleCount?: number, followedGroupsCount?: number): [Tab, Tab] => [
  {
    label: toHtmlFragment(`Saved articles${savedArticleCount !== undefined ? ` (${savedArticleCount})` : ''}`),
    url: `/users/${userId}/saved-articles`,
  },
  {
    label: toHtmlFragment(`Followed groups${followedGroupsCount !== undefined ? ` (${followedGroupsCount})` : ''}`),
    url: `/users/${userId}/followed-groups`,
  },
];
