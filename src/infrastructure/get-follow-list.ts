import FollowList from '../types/follow-list';
import { UserFollowList } from '../types/user-follow-list';

export type GetFollowList = (userFollowList?: UserFollowList) => Promise<FollowList>;

export default (): GetFollowList => (
  async () => new FollowList([])
);
