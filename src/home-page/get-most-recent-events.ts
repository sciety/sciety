import { GetEvents } from './render-feed';
import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

export default (events: NonEmptyArray<Event>, maxCount: number): GetEvents => (
  async () => (
    events
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, maxCount) as unknown as NonEmptyArray<Event>
  )
);
