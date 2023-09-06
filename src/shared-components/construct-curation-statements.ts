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
import * as GID from '../types/group-id';
import { Doi } from '../types/doi';
import { LanguageCode, detectLanguage } from './lang-attribute';
import { EvaluationLocator } from '../types/evaluation-locator';
import { Queries } from '../read-models';
import { FetchReview, Logger } from '../shared-ports';
import { RecordedEvaluation } from '../types/recorded-evaluation';

export type Dependencies = Queries & {
  fetchReview: FetchReview,
  logger: Logger,
};

type CurationStatement = {
  articleId: Doi,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

export type CurationStatementWithGroupAndContent = {
  groupId: GID.GroupId,
  groupName: string,
  groupSlug: string,
  groupLogo: O.Option<string>,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
  evaluationLocator: EvaluationLocator,
};

const addGroupInformation = (dependencies: Dependencies) => (statement: CurationStatement) => pipe(
  statement.groupId,
  dependencies.getGroup,
  E.fromOption(() => {
    dependencies.logger('error', 'Group not found in read model', { statement });
  }),
  E.map((group) => ({
    ...statement,
    groupName: group.name,
    groupSlug: group.slug,
    groupLogo: group.largeLogoPath,
  })),
);

type Partial = {
  groupName: string,
  groupSlug: string,
  groupLogo: O.Option<string>,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

const addEvaluationText = (dependencies: Dependencies) => (partial: Partial) => pipe(
  partial.evaluationLocator,
  dependencies.fetchReview,
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
  doi: Doi
) => T.Task<ReadonlyArray<CurationStatementWithGroupAndContent>>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, doi) => pipe(
  doi,
  dependencies.getEvaluationsForDoi,
  RA.filter((evaluation) => O.getEq(S.Eq).equals(evaluation.type, O.some('curation-statement'))),
  onlyIncludeLatestCurationPerGroup,
  RA.map(addGroupInformation(dependencies)),
  RA.rights,
  T.traverseArray(addEvaluationText(dependencies)),
  T.map(RA.rights),
);
