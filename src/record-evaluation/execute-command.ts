import * as E from 'fp-ts/Either';
import { DomainEvent } from '../domain-events';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';

type ExecuteCommand = (validatedInput: unknown)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<unknown, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = () => () => E.right([]);
