import { ArticleId } from '../../../types/article-id';

export type ListResource = {
  articles: Array<{ articleId: ArticleId, annotated: boolean }>,
  name: string,
  description: string,
};
