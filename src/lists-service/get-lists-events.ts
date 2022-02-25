import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';

export type GetListsEvents = TE.TaskEither<Error, ReadonlyArray<DomainEvent>>;
