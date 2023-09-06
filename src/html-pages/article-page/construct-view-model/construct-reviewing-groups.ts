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
  RA.map((groupId) => dependencies.getGroup(groupId)),
  RA.compact,
  RA.map((group) => ({ groupName: group.name, href: `/groups/${group.slug}`, logoPath: group.largeLogoPath })),
);
