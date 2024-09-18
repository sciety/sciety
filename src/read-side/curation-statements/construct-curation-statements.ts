import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { CurationStatement } from './curation-statement';
import { byMostRecentlyPublished, RecordedEvaluation } from '../../read-models/evaluations';
import { constructGroupPagePath } from '../../standards/paths';
import { EvaluationLocator } from '../../types/evaluation-locator';
import * as GID from '../../types/group-id';
import * as PH from '../../types/publishing-history';
import { DependenciesForViews } from '../dependencies-for-views';
import { detectLanguage } from '../html-pages/shared-components/lang-attribute';

type PartialCurationStatement = {
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

const addGroupInformation = (dependencies: DependenciesForViews) => (statement: PartialCurationStatement) => pipe(
  statement.groupId,
  dependencies.getGroup,
  E.fromOption(() => {
    dependencies.logger('error', 'Group not found in read model', { statement });
  }),
  E.map((group) => ({
    ...statement,
    groupName: group.name,
    groupLogoSrc: group.largeLogoPath,
    groupPageHref: constructGroupPagePath.home.href(group),
  })),
);

type Partial = Omit<CurationStatement, 'statementLanguageCode' | 'statement'>;

const addEvaluationText = (dependencies: DependenciesForViews) => (partial: Partial) => pipe(
  partial.evaluationLocator,
  dependencies.fetchEvaluationDigest,
  TE.map((digest) => ({
    ...partial,
    statement: digest,
    statementLanguageCode: detectLanguage(digest),
  })),
);

const hasSameGroupId: Eq.Eq<RecordedEvaluation> = Eq.struct({
  groupId: S.Eq,
});

const onlyIncludeLatestCurationPerGroup = (
  curationStatements: ReadonlyArray<RecordedEvaluation>,
) => pipe(
  curationStatements,
  RA.sort(byMostRecentlyPublished),
  RA.uniq(hasSameGroupId),
);

type ConstructCurationStatements = (
  dependencies: DependenciesForViews,
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
