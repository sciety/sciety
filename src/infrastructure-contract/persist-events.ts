import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';
import { ErrorMessage } from '../types/error-message';

export type PersistEvents = (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<ErrorMessage, void>;
