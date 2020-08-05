import { GetEvents } from './render-feed';
import { Event, isEditorialCommunityJoinedEvent } from '../types/events';
import { FollowList } from '../types/follow-list';
import { NonEmptyArray } from '../types/non-empty-array';

export type GetFollowList = () => Promise<FollowList>;

export default (getFollowList: GetFollowList, events: NonEmptyArray<Event>, maxCount: number): GetEvents => (
  async () => {
    const followList = await getFollowList();
    return events
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .filter((event) => (
        isEditorialCommunityJoinedEvent(event)
        || followList.some((actorId) => actorId.value === event.actorId.value)
      ))
      .slice(0, maxCount) as unknown as NonEmptyArray<Event>;
  }
);
