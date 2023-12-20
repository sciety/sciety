import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import { Evaluation } from './evaluation';
import * as DE from '../../types/data-error';
import { ArticleId } from '../../types/article-id';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { inferredSourceUrl, EvaluationLocator } from '../../types/evaluation-locator';
import { Queries } from '../../read-models';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import * as EDOI from '../../types/expression-doi';

export type DocmapViewModel = {
  articleId: ArticleId,
  group: Group,
  evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation>,
  updatedAt: Date,
};

type DocmapIdentifier = {
  articleId: ArticleId,
  groupId: GroupId,
};

type ConstructDocmapViewModel = (
  adapters: Ports
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, DocmapViewModel>;

export type Ports = Queries & {
  fetchReview: (reviewId: EvaluationLocator) => TE.TaskEither<DE.DataError, { url: URL }>,
};

const extendWithSourceUrl = (adapters: Ports) => (evaluation: RecordedEvaluation) => pipe(
  evaluation.evaluationLocator,
  inferredSourceUrl,
  O.fold(
    () => pipe(
      evaluation.evaluationLocator,
      adapters.fetchReview,
      TE.map((fetchedReview) => ({
        ...evaluation,
        sourceUrl: fetchedReview.url,
      })),
    ),
    (sourceUrl) => TE.right({
      ...evaluation,
      sourceUrl,
    }),
  ),
);

export const constructDocmapViewModel: ConstructDocmapViewModel = (adapters) => ({ articleId, groupId }) => pipe(
  {
    articleId: TE.right(articleId),
    evaluations: pipe(
      adapters.getEvaluationsOfExpression(EDOI.fromValidatedString(articleId.value)),
      TE.right,
      TE.map(RA.filter((ev) => ev.groupId === groupId)),
      TE.chainW(TE.traverseArray(extendWithSourceUrl(adapters))),
      TE.chainEitherKW(flow(
        RNEA.fromReadonlyArray,
        E.fromOption(() => DE.notFound),
      )),
    ),
    group: pipe(
      adapters.getGroup(groupId),
      TE.fromOption(() => DE.notFound),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    ...partial,
    updatedAt: pipe(
      partial.evaluations,
      RNEA.map((evaluation) => evaluation.updatedAt),
      RNEA.max(D.Ord),
    ),
  })),
);
