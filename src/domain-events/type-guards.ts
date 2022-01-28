import { DomainEvent } from './domain-event';
import { GroupCreatedEvent } from './group-created-event';

export const isGroupCreatedEvent = (event: DomainEvent):
  event is GroupCreatedEvent => (
  event.type === 'GroupCreated'
);
