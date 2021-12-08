import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { GroupId } from '../types/group-id';

export type Command = {
  groupId: GroupId,
};

type RaiseEventsIfNecessary = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<RuntimeGeneratedEvent>;

export const raiseEventsIfNecessary: RaiseEventsIfNecessary = () => () => [];
