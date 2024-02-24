import * as TE from 'fp-ts/TaskEither';
import { CommandResult } from '../../types/command-result.js';
import { ErrorMessage } from '../../types/error-message.js';

export type GenericCommand = { [key: string]: unknown };

export type CommandHandler<C extends GenericCommand> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;
