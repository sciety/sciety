import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type GetOneArticleReadyToBeListed = () => O.Option<ArticleWithSubjectArea>;

export type ArticleWithSubjectArea = { articleId: Doi, listId: ListId };
