import { Tab } from '../../../../../shared-components/tabs';
import { toHtmlFragment } from '../../../../../types/html-fragment';
import { UserHandle } from '../../../../../types/user-handle';

export const tabList = (userHandle: UserHandle, listCount: number, followingCount: number): [Tab, Tab] => [
  {
    label: toHtmlFragment(`Lists (${listCount})`),
    url: `/users/${userHandle}/lists`,
  },
  {
    label: toHtmlFragment(`Following (${followingCount})`),
    url: `/users/${userHandle}/following`,
  },
];
