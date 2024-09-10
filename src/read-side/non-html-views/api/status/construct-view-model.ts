import { StatusData } from './render-as-json';
import { DependenciesForViews } from '../../../dependencies-for-views';

export const constructViewModel = (dependencies: DependenciesForViews): StatusData => ({
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
