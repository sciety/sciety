import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../../types/expression-doi';
import * as PH from '../../../../types/publishing-history';
import { constructArticleCard } from '../../shared-components/article-card';
import { ViewModel } from '../view-model';

const buildRelatedArticleCards = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
) => (recommendedPapers: ReadonlyArray<ExpressionDoi>) => pipe(
  recommendedPapers,
  TE.traverseArray(constructArticleCard(dependencies)),
  TE.mapLeft((relatedArticleError) => {
    dependencies.logger('error', 'at least one related article paper activity summary card could not be constructed', {
      relatedArticleError,
      paperExpressionDoi: PH.getLatestExpression(history).expressionDoi,
    });
    return relatedArticleError;
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
