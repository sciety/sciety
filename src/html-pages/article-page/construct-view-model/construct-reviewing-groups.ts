import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { constructGroupLinkWithLogoViewModel } from '../../../shared-components/group-link-with-logo/construct-group-link-with-logo-view-model';
import { RecordedEvaluation } from '../../../types/recorded-evaluation';
import { Doi } from '../../../types/doi';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: Doi,
): ViewModel['reviewingGroups'] => pipe(
  articleId,
  dependencies.getEvaluationsForDoi,
  RA.filter(isNotCurationStatement),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLinkWithLogoViewModel(dependencies)),
  RA.compact,
);
