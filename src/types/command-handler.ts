import * as TE from 'fp-ts/TaskEither';
import { CommandResult } from './command-result';
import { ErrorMessage } from './error-message';

export type CommandHandler<C> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;
