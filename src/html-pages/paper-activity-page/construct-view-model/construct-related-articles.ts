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
  TE.filterOrElse(
    (queryResult) => queryResult.length > 0,
    () => 'query-returned-no-results',
  ),
  TE.map(RA.takeLeft(3)),
  TE.chainW(TE.traverseArray(constructPaperActivitySummaryCard(dependencies))),
  TE.mapLeft((error) => {
    dependencies.logger('error', 'constructRelatedArticles has failed', { error, history });
    return error;
  }),
  TO.fromTaskEither,
);
