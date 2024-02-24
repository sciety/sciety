import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error.js';
import { ExpressionFrontMatter } from '../types/expression-front-matter.js';
import * as PH from '../types/publishing-history.js';
import { ExternalQueries } from '../third-parties/index.js';

export const constructFrontMatter = (
  dependencies: ExternalQueries,
) => (
  history: PH.PublishingHistory,
): TE.TaskEither<DE.DataError, ExpressionFrontMatter> => pipe(
  PH.getLatestExpression(history),
  (expression) => expression.expressionDoi,
  dependencies.fetchExpressionFrontMatter,
);
