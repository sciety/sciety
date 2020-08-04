import { GetEvents } from './render-feed';
import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

export default (events: NonEmptyArray<Event>): GetEvents => (
  async () => {
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    return events.slice(0, 20) as unknown as NonEmptyArray<Event>;
  }
);
