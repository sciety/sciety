import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events/index.js';
import { CommandResult } from '../types/command-result.js';
import { ErrorMessage } from '../types/error-message.js';

export type CommitEvents = (event: ReadonlyArray<DomainEvent>) => TE.TaskEither<ErrorMessage, CommandResult>;
