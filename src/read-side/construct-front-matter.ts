import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import { ExpressionFrontMatter } from '../types/expression-front-matter';
import * as PH from '../types/publishing-history';

export const constructFrontMatter = (
  dependencies: ExternalQueries,
) => (
  history: PH.PublishingHistory,
): TE.TaskEither<DE.DataError, ExpressionFrontMatter> => pipe(
  PH.getLatestExpression(history),
  (expression) => expression.expressionDoi,
  dependencies.fetchExpressionFrontMatter,
);
