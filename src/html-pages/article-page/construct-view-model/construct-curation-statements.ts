import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as GID from '../../../types/group-id';
import { Doi } from '../../../types/doi';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { EvaluationLocator, toEvaluationLocator } from '../../../types/evaluation-locator';

// ts-unused-exports:disable-next-line
export const magicArticleId = '10.1101/2022.02.23.481615';

type CurationStatement = {
  articleId: Doi,
  evaluationLocator: EvaluationLocator,
  groupId: GID.GroupId,
};

// ts-unused-exports:disable-next-line
export const curationStatements: ReadonlyArray<CurationStatement> = [
  {
    articleId: new Doi(magicArticleId),
    groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    evaluationLocator: toEvaluationLocator('hypothesis:YSEnWoeKEe2O2nN67bYvsA'),
  },
  {
    articleId: new Doi(magicArticleId),
    groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    evaluationLocator: toEvaluationLocator('hypothesis:TfCA6maDEe2zm3_n3MyxjA'),
  },
];

const getCurationStatements = (articleId: Doi) => (
  (articleId.value === magicArticleId) ? curationStatements : []
);

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

type ConstructCurationStatements = (dependencies: Dependencies, doi: Doi) => T.Task<ViewModel['curationStatements']>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, doi) => pipe(
  doi,
  getCurationStatements,
  RA.map(addGroupInformation(dependencies)),
  RA.rights,
  T.traverseArray(addEvaluationText(dependencies)),
  T.map(RA.rights),
);
