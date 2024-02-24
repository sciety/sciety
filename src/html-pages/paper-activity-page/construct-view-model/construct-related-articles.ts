import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card/index.js';
import { ViewModel } from '../view-model.js';
import { Dependencies } from './dependencies.js';
import * as PH from '../../../types/publishing-history.js';

export const constructRelatedArticles = (
  history: PH.PublishingHistory,
  dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  history,
  dependencies.fetchRecommendedPapers,
  TE.mapLeft((error) => {
    dependencies.logger('warn', 'Construct related articles has failed', { error, expressionDoi: history });
    return error;
  }),
  TE.map((expressionDois) => {
    dependencies.logger('debug', 'Construct related articles has been successful', { expressionDoi: history });
    return expressionDois;
  }),
  TE.map(RA.takeLeft(3)),
  TE.chainW(TE.traverseArray(constructPaperActivitySummaryCard(dependencies))),
  TO.fromTaskEither,
);
