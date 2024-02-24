import * as E from 'fp-ts/Either';
import { DomainEvent } from '../../domain-events/index.js';
import { ErrorMessage } from '../../types/error-message.js';

export type ResourceAction<C> = (command: C)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;
