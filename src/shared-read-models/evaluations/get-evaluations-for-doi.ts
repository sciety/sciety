import * as O from 'fp-ts/Option';
import { identity, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { ReadModel } from './handle-event';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type GetEvaluationsForDoi = (articleDoi: Doi) => ReadonlyArray<RecordedEvaluation>;

export const getEvaluationsForDoi = (readmodel: ReadModel): GetEvaluationsForDoi => (articleId) => pipe(
  readmodel.byArticleId.get(articleId.value),
  O.fromNullable,
  O.match(
    () => [],
    identity,
  ),
);
