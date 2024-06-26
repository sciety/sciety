import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { DocmapViewModel } from './view-model';
import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';
import * as DE from '../../../../types/data-error';
import * as EDOI from '../../../../types/expression-doi';
import { GroupId } from '../../../../types/group-id';
import { RecordedEvaluation } from '../../../../types/recorded-evaluation';

type DocmapIdentifier = {
  expressionDoi: EDOI.ExpressionDoi,
  groupId: GroupId,
};

export type Dependencies = Queries & ExternalQueries;

const extendWithSourceUrl = (dependencies: Dependencies) => (evaluation: RecordedEvaluation) => pipe(
  evaluation.evaluationLocator,
  dependencies.fetchEvaluationHumanReadableOriginalUrl,
  TE.map((url) => ({
    ...evaluation,
    sourceUrl: url,
  })),
);

type ConstructDocmapViewModel = (
  dependencies: Dependencies
) => (
  docmapIdentifier: DocmapIdentifier
) => TE.TaskEither<DE.DataError, DocmapViewModel>;

export const constructDocmapViewModel: ConstructDocmapViewModel = (dependencies) => (docmapIdentifier) => pipe(
  {
    expressionDoi: TE.right(docmapIdentifier.expressionDoi),
    evaluations: pipe(
      dependencies.getEvaluationsOfExpression(docmapIdentifier.expressionDoi),
      TE.right,
      TE.map(RA.filter((ev) => ev.groupId === docmapIdentifier.groupId)),
      TE.chainW(TE.traverseArray(extendWithSourceUrl(dependencies))),
      TE.chainEitherKW(flow(
        RNEA.fromReadonlyArray,
        E.fromOption(() => DE.notFound),
      )),
    ),
    group: pipe(
      dependencies.getGroup(docmapIdentifier.groupId),
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
