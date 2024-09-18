import { DependenciesForViews } from '../../../dependencies-for-views';
import { ApiData } from '../render-as-json';

export const constructViewModel = (dependencies: DependenciesForViews): ApiData => ({
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
    ensureEvaluationsAreListed: dependencies.getUnlistedEvaluatedArticles(),
    maintainSnapshotsForEvaluatedExpressions: dependencies.getExpressionsWithNoAssociatedSnapshot(),
    sendNotificationToCoarTestInbox: dependencies.getPendingNotifications(),
  },
});
