import { ArticleId } from '../../types/article-id.js';
import { SubjectArea } from '../../types/subject-area.js';

export type RecordSubjectAreaCommand = { articleId: ArticleId, subjectArea: SubjectArea };
