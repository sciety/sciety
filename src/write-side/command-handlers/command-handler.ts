import * as TE from 'fp-ts/TaskEither';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage } from '../../types/error-message';

export type GenericCommand = { [key: string]: unknown };

export type CommandHandler<C extends GenericCommand> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;
