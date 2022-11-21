import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import { SubjectArea } from '../types/subject-area';

export type GetOneArticleReadyToBeListed = () => O.Option<ArticleWithSubjectArea>;

export type ArticleWithSubjectArea = { articleId: Doi, subjectArea: SubjectArea };
