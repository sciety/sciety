import { toHtmlFragment } from '../../../../../types/html-fragment';
import { UserHandle } from '../../../../../types/user-handle';
import { Tab } from '../../../shared-components/tabs';

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
