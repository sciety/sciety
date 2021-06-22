import { Tab } from '../shared-components/tabs';
import { UserId } from '../types/user-id';

export const tabList = (userId: UserId): [Tab, Tab] => [
  { label: 'Saved articles', url: `/users/${userId}/saved-articles` },
  { label: 'Followed groups', url: `/users/${userId}/followed-groups` },
];
