import * as TE from 'fp-ts/TaskEither';
import { expandPaperExpressions } from './expand-paper-expressions';
import { getPaperExpressionsFromBiorxiv } from './get-paper-expressions-from-biorxiv';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { PaperExpression } from '../../../types/paper-expression';
import { QueryExternalService } from '../../query-external-service';

type ExpandMonolithicBiorxivOrMedrvixExpressions = (queryExternalService: QueryExternalService, logger: Logger)
=> (expressionsFromCrossref: ReadonlyArray<PaperExpression>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

export const expandMonolithicBiorxivOrMedrxivExpressions: ExpandMonolithicBiorxivOrMedrvixExpressions = (
  queryExternalService,
  logger,
) => expandPaperExpressions(getPaperExpressionsFromBiorxiv({ queryExternalService, logger }));
