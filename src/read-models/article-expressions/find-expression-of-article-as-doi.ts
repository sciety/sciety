/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleId } from '../../types/article-id';
import { ArticleExpressionDoi } from '../../types/article-expression-doi';
import { ReadModel } from './handle-event';
import { hardcodedReadModel } from './hardcoded-read-model';

export const findExpressionOfArticleAsDoi = (
  readModel: ReadModel,
) => (articleId: ArticleId): O.Option<ArticleExpressionDoi> => {
  if (articleId.value.startsWith('uuid:')) {
    return pipe(
      hardcodedReadModel.get(articleId.value),
      O.fromNullable,
      O.map(RNEA.last),
      O.map((readModelEntry) => readModelEntry.articleExpressionDoi),
    );
  }
  return O.some(articleId);
};
