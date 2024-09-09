import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
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
    sendNotificationToCoarTestInbox: pipe(
      dependencies.getPendingNotifications(),
      RA.map((pendingNotification) => ({
        ...pendingNotification,
        target: {
          id: pendingNotification.target.id,
          inbox: pendingNotification.target.inbox.href,
        },
      })),
    ),
  },
});
