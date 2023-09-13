import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { Doi } from '../../types/doi';
import { Queries } from '../../read-models';
import { GroupLinkWithLogoViewModel, constructGroupLinkWithLogo, ConstructGroupLinkWithLogoDependencies } from '../group-link-with-logo';

type Dependencies = Queries
& ConstructGroupLinkWithLogoDependencies;

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: Doi,
): ReadonlyArray<GroupLinkWithLogoViewModel> => pipe(
  articleId,
  dependencies.getEvaluationsForDoi,
  RA.filter(isNotCurationStatement),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLinkWithLogo(dependencies)),
  RA.compact,
);
