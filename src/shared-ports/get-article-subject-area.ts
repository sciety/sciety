import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { ArticleId } from '../types/article-id';
import { SubjectArea } from '../types/subject-area';

export type GetArticleSubjectArea = (articleId: ArticleId) => TE.TaskEither<DE.DataError, SubjectArea>;
