import { Doi } from '../types/doi';
import { SubjectArea } from '../types/subject-area';

export type RecordSubjectAreaCommand = { articleId: Doi, subjectArea: SubjectArea };
