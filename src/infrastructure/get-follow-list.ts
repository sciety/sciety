import { FollowList } from '../types/follow-list';

export type GetFollowList = () => Promise<FollowList>;

export default (followList: FollowList): GetFollowList => (
  async () => followList
);
