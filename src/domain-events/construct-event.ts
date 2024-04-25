import { EventName, EventOfType } from './domain-event';
import { EventId, generate } from '../types/event-id';

type EventSpecificFields<T extends EventName> = Omit<EventOfType<T>, 'type' | 'id' | 'date'>;

type EventBase<T> = {
  id: EventId,
  date: Date,
  type: T,
};

export const constructEvent = <
T extends EventName,
A extends EventSpecificFields<T>,
>(type: T) => (args: A & Partial<{ date: Date }>): EventBase<T> & A => ({
    type,
    id: generate(),
    date: new Date(),
    ...args,
  });
