import * as TE from 'fp-ts/TaskEither';
import { RecordSubjectAreaCommand } from '../commands';
import { CommandResult } from '../types/command-result';
import { ErrorMessage } from '../types/error-message';

type CommandHandler<C> = (command: C) => TE.TaskEither<ErrorMessage, CommandResult>;

export type RecordSubjectArea = CommandHandler<RecordSubjectAreaCommand>;
