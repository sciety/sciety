import { PaginationControlsViewModel } from '../../shared-components/pagination';
import { UserHandle } from '../../../types/user-handle';
import { HeaderViewModel } from '../sub-page-header';

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
