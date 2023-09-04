import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { RecordedEvaluation } from '../../../types/recorded-evaluation';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: Doi,
): ViewModel['reviewingGroups'] => pipe(
  articleId,
  dependencies.getEvaluationsForDoi,
  RA.filter(isNotCurationStatement),
  RA.map((evaluation) => evaluation.groupId),
  RA.map((groupId) => dependencies.getGroup(groupId)),
  RA.compact,
  RA.map((group) => group.name),
  (groupNames) => [...new Set(groupNames)],
  RA.map((name) => ({ name })),
);
