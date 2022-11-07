import * as TE from 'fp-ts/TaskEither';
import { RecordSubjectAreaCommand } from '../commands';
import { ErrorMessage } from '../types/error-message';

export type RecordSubjectArea = (command: RecordSubjectAreaCommand) => TE.TaskEither<ErrorMessage, void>;
