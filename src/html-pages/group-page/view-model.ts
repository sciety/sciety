import { HtmlFragment } from '../../types/html-fragment';
import { ContentModel } from './content-model';

export type ViewModel = ContentModel & {
  activeTabContent: HtmlFragment,
  isFollowing: boolean,
};
