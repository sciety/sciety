import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';

export type CommitEvents = (event: ReadonlyArray<DomainEvent>) => TE.TaskEither<never, CommandResult>;
