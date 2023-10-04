import { ArticleId } from '../../../types/article-id';

export type ListResource = {
  articleIds: Array<ArticleId>,
  name: string,
  description: string,
};
