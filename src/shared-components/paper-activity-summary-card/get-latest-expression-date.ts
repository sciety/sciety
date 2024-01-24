import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../types/expression-doi';
import { Dependencies } from './dependencies';
import * as PH from '../../types/publishing-history';

type GetLatestExpressionDate = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi) => TO.TaskOption<Date>;

export const getLatestExpressionDate: GetLatestExpressionDate = (
  dependencies,
) => (
  expressionDoi,
) => pipe(
  expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.map(PH.getLatestExpression),
  TE.map((version) => version.publishedAt),
  TO.fromTaskEither,
);
