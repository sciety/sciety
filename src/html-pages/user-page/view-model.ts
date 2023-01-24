import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  mainContent: HtmlFragment,
  userDisplayName: string,
  description: string,
};
