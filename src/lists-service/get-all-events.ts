import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';

export type GetAllEvents = TE.TaskEither<Error, ReadonlyArray<DomainEvent>>;
