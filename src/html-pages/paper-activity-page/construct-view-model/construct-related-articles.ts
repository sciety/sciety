import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { ExpressionDoi } from '../../../types/expression-doi';
import * as PH from '../../../types/publishing-history';
import { ViewModel } from '../view-model';

const buildRelatedArticleCards = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
) => (recommendedPapers: ReadonlyArray<ExpressionDoi>) => pipe(
  recommendedPapers,
  TE.traverseArray(constructPaperActivitySummaryCard(dependencies)),
  TE.mapLeft((error) => {
    dependencies.logger('error', 'at least one paper activity summary card could not be constructed', {
      error,
      paperExpressionDoi: PH.getLatestExpression(history).expressionDoi,
    });
    return error;
  }),
);

const failIfNoResultsReturned = (dependencies: Dependencies, history: PH.PublishingHistory) => TE.filterOrElseW(
  (queryResult: ReadonlyArray<ExpressionDoi>) => queryResult.length > 0,
  () => {
    dependencies.logger('error', 'fetchRecommendedPapers returned no results', { paperExpressionDoi: PH.getLatestExpression(history).expressionDoi });
    return 'query-returned-no-results' as const;
  },
);

export const constructRelatedArticles = (
  history: PH.PublishingHistory,
  dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  history,
  dependencies.fetchRecommendedPapers,
  failIfNoResultsReturned(dependencies, history),
  TE.map(RA.takeLeft(3)),
  TE.chainW(buildRelatedArticleCards(dependencies, history)),
  TO.fromTaskEither,
);
