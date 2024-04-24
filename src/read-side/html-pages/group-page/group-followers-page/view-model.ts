import { PaginationControlsViewModel } from '../../../../html-pages/shared-components/pagination';
import { UserHandle } from '../../../../types/user-handle';
import { ViewModel as HeaderViewModel } from '../common-components/render-page-header';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarSrc: string,
};

export type ViewModel = {
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  pagination: PaginationControlsViewModel,
  header: HeaderViewModel,
};
