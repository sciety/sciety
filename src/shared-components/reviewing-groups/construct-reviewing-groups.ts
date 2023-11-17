import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { GroupLinkAsTextViewModel } from '../group-link/group-link-as-text-view-model.js';
import { RecordedEvaluation } from '../../types/recorded-evaluation.js';
import { ArticleId } from '../../types/article-id.js';
import { Queries } from '../../read-models/index.js';
import { GroupLinkWithLogoViewModel, constructGroupLink, ConstructGroupLinkDependencies } from '../group-link/index.js';

export type Dependencies = Queries
& ConstructGroupLinkDependencies;

const isNotCurationStatement = (evaluation: RecordedEvaluation) => pipe(
  evaluation.type,
  O.getOrElseW(() => undefined),
) !== 'curation-statement';

const byPublishedAt: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((evaluation) => evaluation.publishedAt),
);

const unique = <A>(input: ReadonlyArray<A>) => [...new Set(input)];

export const constructReviewingGroups = (
  dependencies: Dependencies,
  articleId: ArticleId,
): ReadonlyArray<GroupLinkWithLogoViewModel & GroupLinkAsTextViewModel> => pipe(
  articleId,
  dependencies.getEvaluationsForArticle,
  RA.filter(isNotCurationStatement),
  RA.sort(byPublishedAt),
  RA.map((evaluation) => evaluation.groupId),
  unique,
  RA.map(constructGroupLink(dependencies)),
  RA.compact,
);
