import { DomainEvent } from '../domain-events';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';

type RaiseEventsIfNecessary = (validatedInput: unknown)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<RuntimeGeneratedEvent>;

export const raiseEventsIfNecessary: RaiseEventsIfNecessary = () => () => [];
