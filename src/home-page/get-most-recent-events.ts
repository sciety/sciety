import { GetEvents } from './render-feed';
import { Event, isEditorialCommunityJoinedEvent } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

export default (events: NonEmptyArray<Event>, maxCount: number): GetEvents => (
  async (followList) => (
    events
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .filter((event) => (
        isEditorialCommunityJoinedEvent(event)
        || followList.find((actorId) => actorId.value === event.actorId.value)
      ))
      .slice(0, maxCount) as unknown as NonEmptyArray<Event>
  )
);
