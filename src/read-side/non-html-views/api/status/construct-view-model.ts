import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../dependencies-for-views';

export const constructViewModel = (dependencies: DependenciesForViews): unknown => ({
  readModels: {
    annotations: dependencies.annotationsStatus(),
    evaluations: dependencies.evaluationsStatus(),
    followings: dependencies.followingsStatus(),
    groups: {
      total: dependencies.getAllGroups().length,
    },
    lists: dependencies.listsStatus(),
    papersEvaluatedByGroup: dependencies.papersEvaluatedByGroupStatus(),
    users: dependencies.usersStatus(),
  },
  sagaWorkQueues: {
    ensureEvaluationsAreListed: pipe(
      dependencies.getUnlistedEvaluatedArticles(),
      RA.map((missingArticle) => ({
        expressionDoi: missingArticle.expressionDoi.value,
        listId: missingArticle.listId,
      })),
    ),
    maintainSnapshotsForEvaluatedExpressions: dependencies.getExpressionsWithNoAssociatedSnapshot(),
    sendNotificationToCoarTestInbox: dependencies.getPendingNotifications(),
  },
});
