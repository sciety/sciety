import { Tab } from '../shared-components/tabs';
import { toHtmlFragment } from '../types/html-fragment';

export const tabList = (userHandle: string, savedArticleCount: number, followingCount: number): [Tab, Tab] => [
  {
    label: toHtmlFragment(`Saved articles (${savedArticleCount})`),
    url: `/users/${userHandle}/saved-articles`,
  },
  {
    label: toHtmlFragment(`Following (${followingCount})`),
    url: `/users/${userHandle}/following`,
  },
];
