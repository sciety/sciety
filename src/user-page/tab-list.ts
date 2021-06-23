import { Tab } from '../shared-components/tabs';
import { toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export const tabList = (userId: UserId): [Tab, Tab] => [
  { label: toHtmlFragment('Saved articles'), url: `/users/${userId}/saved-articles` },
  { label: toHtmlFragment('Followed groups'), url: `/users/${userId}/followed-groups` },
];
