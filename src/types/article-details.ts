import { ArticleId } from './article-id';
import { ExpressionFrontMatter } from './expression-front-matter';

export type ArticleDetails = ExpressionFrontMatter & {
  doi: ArticleId,
};
