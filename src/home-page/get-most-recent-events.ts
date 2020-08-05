import { GetEvents } from './render-feed';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event, isEditorialCommunityJoinedEvent } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

export type GetFollowList = () => Promise<Array<EditorialCommunityId>>;

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
