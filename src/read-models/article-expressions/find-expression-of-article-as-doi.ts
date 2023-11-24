/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArticleId } from '../../types/article-id';
import { DoiOfArticleExpression } from '../../types/doi-of-article-expression';
import { ReadModel } from './handle-event';

export const findExpressionOfArticleAsDoi = (
  readModel: ReadModel,
) => (articleId: ArticleId): DoiOfArticleExpression => {
  if (articleId.value.startsWith('uuid:')) {
    return new DoiOfArticleExpression('10.1099/acmi.0.000530.v1');
  }
  return articleId;
};
