import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { PaperExpression } from '../../../types/paper-expression';
import * as DE from '../../../types/data-error';
import { Logger } from '../../../shared-ports';
import { isCrossrefWorkPostedContent } from './crossref-work';
import { QueryCrossrefService } from './query-crossref-service';
import { toPaperExpression } from './to-paper-expression';
import { walkRelationGraph } from './walk-relation-graph';

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
  TE.map(RA.filter(isCrossrefWorkPostedContent)),
  TE.map(RA.map(toPaperExpression)),
  TE.map(RA.map(logWhenExpressionServerIsUnsupported(logger))),
);
