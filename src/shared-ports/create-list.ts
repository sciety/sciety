import * as TE from 'fp-ts/TaskEither';
import { CreateListCommand } from '../commands';
import { CommandResult } from '../types/command-result';
import { ErrorMessage } from '../types/error-message';

type CommandHandler<C> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;

export type CreateList = CommandHandler<CreateListCommand>;
