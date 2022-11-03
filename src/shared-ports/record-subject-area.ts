import * as TE from 'fp-ts/TaskEither';
import { RecordSubjectAreaCommand } from '../commands';

export type RecordSubjectArea = (command: RecordSubjectAreaCommand) => TE.TaskEither<string, void>;
