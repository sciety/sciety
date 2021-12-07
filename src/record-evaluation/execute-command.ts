import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { raiseEventsIfNecessary } from './raise-events-if-necessary';
import { DomainEvent } from '../domain-events';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';

type ExecuteCommand = (validatedInput: unknown)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<unknown, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = (validatedInput) => (events) => pipe(
  events,
  raiseEventsIfNecessary(validatedInput),
  E.right,
);
