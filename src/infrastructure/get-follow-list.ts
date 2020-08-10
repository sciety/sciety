import FollowList from '../types/follow-list';

export type GetFollowList = () => Promise<FollowList>;

export default (): GetFollowList => (
  async () => new FollowList([])
);
