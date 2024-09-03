import { expandPaperExpressions } from './expand-paper-expressions';
import { getPaperExpressionsFromBiorxiv } from './get-paper-expressions-from-biorxiv';
import { Logger } from '../../../logger';
import { QueryExternalService } from '../../query-external-service';

export const expandMonolithicBiorxivOrMedrxivExpressions = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ReturnType<typeof expandPaperExpressions> => expandPaperExpressions(
  getPaperExpressionsFromBiorxiv({ queryExternalService, logger }),
);
