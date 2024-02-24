import * as E from 'fp-ts/Either';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as Eq from 'fp-ts/Eq';
import * as GID from '../../types/group-id.js';
import { detectLanguage } from '../../shared-components/lang-attribute/index.js';
import { EvaluationLocator } from '../../types/evaluation-locator.js';
import { Queries } from '../../read-models/index.js';
import { Logger } from '../../infrastructure/index.js';
import { RecordedEvaluation } from '../../types/recorded-evaluation.js';
import { ExternalQueries } from '../../third-parties/index.js';
import { CurationStatement } from './curation-statement.js';
import * as PH from '../../types/publishing-history.js';

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
    groupLogo: group.largeLogoPath,
    groupPageHref: `/groups/${group.slug}`,
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
