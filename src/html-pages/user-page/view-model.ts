import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  mainContent: HtmlFragment,
  groupIds: ReadonlyArray<GroupId>,
};
