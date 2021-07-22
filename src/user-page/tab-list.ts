import { Tab } from '../shared-components/tabs';
import { toHtmlFragment } from '../types/html-fragment';

export const tabList = (userHandle: string, followingCount: number): [Tab, Tab] => [
  {
    label: toHtmlFragment('Lists (1)'),
    url: `/users/${userHandle}/lists`,
  },
  {
    label: toHtmlFragment(`Following (${followingCount})`),
    url: `/users/${userHandle}/following`,
  },
];
