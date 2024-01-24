import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../../types/expression-doi';
import { Dependencies } from './dependencies';
import * as PH from '../../types/publishing-history';
import * as DE from '../../types/data-error';

type GetLatestExpressionDate = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi) => TE.TaskEither<DE.DataError, Date>;

export const getLatestExpressionDate: GetLatestExpressionDate = (
  dependencies,
) => (
  expressionDoi,
) => pipe(
  expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.map(PH.getLatestExpression),
  TE.map((version) => version.publishedAt),
);
