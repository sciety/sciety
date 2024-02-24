import { ExpressionFrontMatter } from './expression-front-matter.js';
import { ArticleId } from './article-id.js';

export type ArticleDetails = ExpressionFrontMatter & {
  doi: ArticleId,
};
