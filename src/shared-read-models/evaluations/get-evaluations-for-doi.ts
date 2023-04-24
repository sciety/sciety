import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { identity, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

export type GetEvaluationsForDoi = (articleDoi: Doi) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsForDoi = (readmodel: ReadModel): GetEvaluationsForDoi => (articleId) => pipe(
  readmodel.byArticleId,
  R.lookup(articleId.value),
  O.match(
    () => [],
    identity,
  ),
);
