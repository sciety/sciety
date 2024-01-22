import { ExpressionFrontMatter } from './expression-front-matter';
import { ArticleId } from './article-id';

export type ArticleDetails = ExpressionFrontMatter & {
  doi: ArticleId,
};
