import { PageHeaderViewModel } from '../common-components/page-header';
import { HtmlFragment } from '../../../types/html-fragment';
import { UserHandle } from '../../../types/user-handle';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type ViewModel = PageHeaderViewModel & {
  followers: ReadonlyArray<UserCardViewModel>,
  nextLink: HtmlFragment,
};
