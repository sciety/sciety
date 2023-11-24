/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArticleId } from '../../types/article-id';
import { ArticleExpressionDoi } from '../../types/article-expression-doi';
import { ReadModel } from './handle-event';

export const findExpressionOfArticleAsDoi = (
  readModel: ReadModel,
) => (articleId: ArticleId): ArticleExpressionDoi => {
  if (articleId.value.startsWith('uuid:')) {
    return new ArticleExpressionDoi('10.1099/acmi.0.000530.v1');
  }
  return articleId;
};
