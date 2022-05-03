import * as T from 'fp-ts/Task';
import { RuntimeGeneratedEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';

export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<CommandResult>;
