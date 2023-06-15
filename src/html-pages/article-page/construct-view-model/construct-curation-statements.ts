import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as GID from '../../../types/group-id';
import { Doi } from '../../../types/doi';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { EvaluationLocator, toEvaluationLocator } from '../../../types/evaluation-locator';
import { updateWithF } from '../../../updateWith';

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

const getGroupInformation = (dependencies: Dependencies) => (input: { groupId: GID.GroupId }) => pipe(
  input.groupId,
  dependencies.getGroup,
  E.fromOption(() => {
    dependencies.logger('error', 'Group not found in read model', { input });
  }),
  E.map((group) => ({
    groupName: group.name,
    groupSlug: group.slug,
    groupLogo: group.largeLogoPath,
  })),
);

const getEvaluationText = (dependencies: Dependencies) => (input: { evaluationLocator: EvaluationLocator }) => pipe(
  input.evaluationLocator,
  dependencies.fetchReview,
  TE.map((review) => ({
    statement: review.fullText,
    statementLanguageCode: detectLanguage(review.fullText),
  })),
);

type ConstructCurationStatements = (dependencies: Dependencies, doi: Doi) => T.Task<ViewModel['curationStatements']>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, doi) => pipe(
  doi,
  dependencies.getCurationStatements,
  RA.map(updateWithF(E.Apply)(getGroupInformation(dependencies))),
  RA.rights,
  RA.map(updateWithF(TE.ApplyPar)(getEvaluationText(dependencies))),
  T.sequenceArray,
  T.map(RA.rights),
);
