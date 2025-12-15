import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { NotificationDetails, retrieveCoarNotificationsByGroup } from './retrieve-coar-notifications-by-group';
import { retrieveReviewActionsFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { Dependencies, DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';

const transformNotificationToReviewActions = (
  dependencies: Dependencies,
) => (
  notificationDetails: NotificationDetails,
) => pipe(
  `https://inbox-sciety-prod.elifesciences.org/inbox/${notificationDetails.notificationId}`,
  transformCoarNotificationUriToAnnouncementActionUri(dependencies),
  TE.flatMap(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies)),
  TE.flatMap(retrieveReviewActionsFromDocmap(dependencies)),
);

export const discoverPciEvaluations = (groupIdentification: string): DiscoverPublishedEvaluations => () => (
  dependencies,
) => pipe(
  groupIdentification,
  retrieveCoarNotificationsByGroup(dependencies),
  TE.flatMap(TE.traverseArray(transformNotificationToReviewActions(dependencies))),
  TE.map(RA.flatten),
  TE.map(RA.map((reviewAction) => constructPublishedEvaluation({
    publishedOn: new Date(reviewAction.actionOutputDate),
    paperExpressionDoi: reviewAction.actionInputDoi,
    evaluationLocator: `doi:${reviewAction.actionOutputDoi}`,
  }))),
  TE.map((publishedEvaluation) => ({
    understood: publishedEvaluation,
    skipped: [],
  })),
);
