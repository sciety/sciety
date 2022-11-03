import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import { SubjectArea } from '../types/subject-area';

export type RecordSubjectArea = (command: { articleId: Doi, subjectArea: SubjectArea }) => TE.TaskEither<string, void>;
