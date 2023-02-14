import { ArticleActivity } from '../types/article-activity';
import { Doi } from '../types/doi';

export type GetActivityForDoi = (articleId: Doi) => ArticleActivity;
