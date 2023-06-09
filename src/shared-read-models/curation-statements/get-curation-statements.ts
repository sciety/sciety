import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import * as GID from '../../types/group-id';
import { toEvaluationLocator } from '../../types/evaluation-locator';
import { CurationStatement, ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export const magicArticleId = '10.1101/2022.02.23.481615';

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
export const getCurationStatements = (readmodel: ReadModel) => (articleId: Doi): ReadonlyArray<CurationStatement> => {
  if (articleId.value === magicArticleId) {
    return curationStatements;
  }
  return pipe(
    readmodel,
    R.lookup(articleId.value),
    O.getOrElseW(() => []),
  );
};
