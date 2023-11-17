import * as TE from 'fp-ts/TaskEither';
import { CommandResult } from './command-result.js';
import { ErrorMessage } from './error-message.js';

export type GenericCommand = { [key: string]: unknown };

export type CommandHandler<C extends GenericCommand> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;
