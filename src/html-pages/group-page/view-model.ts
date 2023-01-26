import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  group: Group,
  followButton: HtmlFragment,
  content: HtmlFragment,
};
