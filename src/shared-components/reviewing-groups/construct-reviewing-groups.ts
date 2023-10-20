import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { GroupLinkAsTextViewModel } from '../group-link/group-link-as-text-view-model';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { ArticleId } from '../../types/article-id';
import { Queries } from '../../read-models';
import { GroupLinkWithLogoViewModel, constructGroupLink, ConstructGroupLinkDependencies } from '../group-link';

export type Dependencies = Queries
& ConstructGroupLinkDependencies;

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: ArticleId,
): ReadonlyArray<GroupLinkWithLogoViewModel & GroupLinkAsTextViewModel> => pipe(
  articleId,
  dependencies.getEvaluationsForArticle,
  RA.filter(isNotCurationStatement),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLink(dependencies)),
  RA.compact,
);
