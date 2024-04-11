import { PaginationControlsViewModel } from '../../shared-components/pagination';
import { UserHandle } from '../../../types/user-handle';
import { ViewModel as HeaderViewModel } from '../sub-page-header/render-page-header';

export type UserCardViewModel = {
  link: string,
  title: string,
  handle: UserHandle,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

export type ViewModel = {
  followerCount: number,
  followers: ReadonlyArray<UserCardViewModel>,
  pagination: PaginationControlsViewModel,
  header: HeaderViewModel,
};
