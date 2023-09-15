import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';
import { ErrorMessage } from '../types/error-message';

export type CommitEvents = (event: ReadonlyArray<DomainEvent>) => TE.TaskEither<ErrorMessage, CommandResult>;
