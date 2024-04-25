import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { CurationStatement } from './curation-statement';
import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { ExternalQueries } from '../../third-parties';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as GID from '../../types/group-id';
import * as PH from '../../types/publishing-history';
import { RecordedEvaluation } from '../../types/recorded-evaluation';
import { detectLanguage } from '../html-pages/shared-components/lang-attribute';
import { constructGroupPageHref } from '../paths';

export type Dependencies = Queries & ExternalQueries & {
  logger: Logger,
};

type PartialCurationStatement = {
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

const addGroupInformation = (dependencies: Dependencies) => (statement: PartialCurationStatement) => pipe(
  statement.groupId,
  dependencies.getGroup,
  E.fromOption(() => {
    dependencies.logger('error', 'Group not found in read model', { statement });
  }),
  E.map((group) => ({
    ...statement,
    groupName: group.name,
    groupLogoSrc: group.largeLogoPath,
    groupPageHref: constructGroupPageHref(group),
  })),
);

type Partial = Omit<CurationStatement, 'statementLanguageCode' | 'statement'>;

const addEvaluationText = (dependencies: Dependencies) => (partial: Partial) => pipe(
  partial.evaluationLocator,
  dependencies.fetchEvaluation,
  TE.map((review) => ({
    ...partial,
    statement: review.fullText,
    statementLanguageCode: detectLanguage(review.fullText),
  })),
);

const byPublishedAt: Ord.Ord<RecordedEvaluation> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.publishedAt),
);

const hasSameGroupId: Eq.Eq<RecordedEvaluation> = Eq.struct({
  groupId: S.Eq,
});

const onlyIncludeLatestCurationPerGroup = (
  curationStatements: ReadonlyArray<RecordedEvaluation>,
) => pipe(
  curationStatements,
  RA.sort(byPublishedAt),
  RA.uniq(hasSameGroupId),
);

type ConstructCurationStatements = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
) => T.Task<ReadonlyArray<CurationStatement>>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, history) => pipe(
  PH.getAllExpressionDois(history),
  dependencies.getEvaluationsOfMultipleExpressions,
  RA.filter((evaluation) => O.getEq(S.Eq).equals(evaluation.type, O.some('curation-statement'))),
  onlyIncludeLatestCurationPerGroup,
  RA.map(addGroupInformation(dependencies)),
  RA.rights,
  T.traverseArray(addEvaluationText(dependencies)),
  T.map(RA.rights),
);
