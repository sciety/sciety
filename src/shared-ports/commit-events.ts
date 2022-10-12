import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';

export type CommitEvents = (event: ReadonlyArray<DomainEvent>) => T.Task<CommandResult>;
