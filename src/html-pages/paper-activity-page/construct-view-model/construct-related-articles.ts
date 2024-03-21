import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import * as PH from '../../../types/publishing-history';

export const constructRelatedArticles = (
  history: PH.PublishingHistory,
  dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  history,
  dependencies.fetchRecommendedPapers,
  TE.filterOrElseW(
    (queryResult) => queryResult.length > 0,
    () => {
      dependencies.logger('error', 'fetchRecommendedPapers returned no results', { paperExpressionDoi: PH.getLatestExpression(history).expressionDoi });
      return 'query-returned-no-results' as const;
    },
  ),
  TE.map(RA.takeLeft(3)),
  TE.chainW((recommendedPapers) => pipe(
    recommendedPapers,
    TE.traverseArray(constructPaperActivitySummaryCard(dependencies)),
    TE.mapLeft((error) => {
      dependencies.logger('error', 'at least one paper activity summary card could not be constructed', {
        error,
        paperExpressionDoi: PH.getLatestExpression(history).expressionDoi,
      });
      return error;
    }),
  )),
  TO.fromTaskEither,
);
