import * as TE from 'fp-ts/TaskEither';
import { CommandResult } from './command-result';
import { ErrorMessage } from './error-message';

export type GenericCommand = { [key: string]: unknown };

export type CommandHandler<C extends GenericCommand> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;
