import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { QueryCrossrefService } from './query-crossref-service';
import { initialState } from './state';
import { toPaperExpression } from './to-paper-expression';
import { walkRelationGraph } from './walk-relation-graph';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { ExpressionDoi } from '../../../types/expression-doi';
import { PaperExpression } from '../../../types/paper-expression';

const logWhenExpressionServerIsUnsupported = (logger: Logger) => (expression: PaperExpression) => {
  if (O.isNone(expression.server)) {
    logger('warn', 'Paper expression server not known', {
      expressionDoi: expression.expressionDoi,
      publisherHtmlUrl: expression.publisherHtmlUrl,
    });
  }
  return expression;
};

type FetchAllPaperExpressionsFromCrossref = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
  doi: ExpressionDoi
)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

const recursionLimit = 1000;

export const fetchAllPaperExpressionsFromCrossref: FetchAllPaperExpressionsFromCrossref = (
  queryCrossrefService,
  logger,
  doi,
) => pipe(
  doi,
  initialState,
  walkRelationGraph(queryCrossrefService, logger, doi, recursionLimit),
  TE.map(RA.map(toPaperExpression)),
  TE.map(RA.rights),
  TE.map(RA.map(logWhenExpressionServerIsUnsupported(logger))),
  TE.mapLeft((error) => {
    if (error === 'too-much-recursion') {
      return DE.unavailable;
    }
    return error;
  }),
);
