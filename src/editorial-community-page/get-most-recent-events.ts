import { GetEvents } from './render-feed';
import { Event } from '../types/events';
import FollowList from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

export type GetFollowList = () => Promise<FollowList>;

export default (events: NonEmptyArray<Event>, maxCount: number): GetEvents => (
  async (editorialCommunityId) => {
    const followList = new FollowList([editorialCommunityId]);
    return events
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .filter((event) => followList.follows(event.actorId))
      .slice(0, maxCount);
  }
);
