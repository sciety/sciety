import { Doi } from '../../types/doi';
import * as GID from '../../types/group-id';
import { EvaluationLocator, toEvaluationLocator } from '../../types/evaluation-locator';
import { ReadModel } from './handle-event';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCurationStatements = (readmodel: ReadModel) => (articleId: Doi): ReadonlyArray<CurationStatement> => (
  (articleId.value === magicArticleId) ? curationStatements : []
);
