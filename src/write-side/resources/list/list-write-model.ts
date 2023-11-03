import { ArticleId } from '../../../types/article-id';

export type ListWriteModel = {
  articles: Array<{ articleId: ArticleId, annotated: boolean }>,
  name: string,
  description: string,
};
