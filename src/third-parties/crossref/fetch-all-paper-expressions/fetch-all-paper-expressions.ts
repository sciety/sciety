import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PaperExpression } from '../../../types/paper-expression.js';
import * as DE from '../../../types/data-error.js';
import { Logger } from '../../../infrastructure/index.js';
import { QueryCrossrefService } from './query-crossref-service.js';
import { toPaperExpression } from './to-paper-expression.js';
import { walkRelationGraph } from './walk-relation-graph.js';

const logWhenExpressionServerIsUnsupported = (logger: Logger) => (expression: PaperExpression) => {
  if (O.isNone(expression.server)) {
    logger('warn', 'Paper expression server not known', {
      expressionDoi: expression.expressionDoi,
      publisherHtmlUrl: expression.publisherHtmlUrl,
    });
  }
  return expression;
};

type FetchAllPaperExpressions = (queryCrossrefService: QueryCrossrefService, logger: Logger, doi: string)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

export const fetchAllPaperExpressions: FetchAllPaperExpressions = (
  queryCrossrefService,
  logger,
  doi,
) => pipe(
  {
    queue: [doi],
    collectedWorks: new Map(),
  },
  walkRelationGraph(queryCrossrefService, logger, doi),
  TE.map(RA.map(toPaperExpression)),
  TE.map(RA.rights),
  TE.map(RA.map(logWhenExpressionServerIsUnsupported(logger))),
);
