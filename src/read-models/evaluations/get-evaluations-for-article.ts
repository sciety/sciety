import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { ArticleId } from '../../types/article-id';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type GetEvaluationsForArticle = (articleDoi: ArticleId) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsForArticle = (readmodel: ReadModel): GetEvaluationsForArticle => (articleId) => pipe(
  readmodel.byArticleId.get(articleId.value),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
