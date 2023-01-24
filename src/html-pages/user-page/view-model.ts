import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  header: HtmlFragment,
  mainContent: HtmlFragment,
  userDisplayName: string,
  description: string,
};
