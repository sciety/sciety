import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error.js';
import { ArticleId } from '../types/article-id.js';
import { SubjectArea } from '../types/subject-area.js';

export type GetArticleSubjectArea = (articleId: ArticleId) => TE.TaskEither<DE.DataError, SubjectArea>;
