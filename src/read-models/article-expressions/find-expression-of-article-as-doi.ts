/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { ArticleId } from '../../types/article-id';
import { ArticleExpressionDoi } from '../../types/article-expression-doi';
import { ReadModel } from './handle-event';

export const findExpressionOfArticleAsDoi = (
  readModel: ReadModel,
) => (articleId: ArticleId): O.Option<ArticleExpressionDoi> => {
  if (articleId.value.startsWith('uuid:')) {
    return O.some(new ArticleExpressionDoi('10.1099/acmi.0.000530.v1'));
  }
  return O.some(articleId);
};
