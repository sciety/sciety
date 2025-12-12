import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { retrieveReviewActionsFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { Dependencies, DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';

const transformNotificationToReviewActions = (dependencies: Dependencies) => (notification: string) => pipe(
  `https://inbox-sciety-prod.elifesciences.org/inbox/${notification}`,
  transformCoarNotificationUriToAnnouncementActionUri(dependencies),
  TE.flatMap(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies)),
  TE.flatMap(retrieveReviewActionsFromDocmap(dependencies)),
);

export const discoverPciEvaluations: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  [
    'urn:uuid:6d59e586-5c75-417c-ae15-6abdd8030539',
    'urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
  ],
  TE.traverseArray(transformNotificationToReviewActions(dependencies)),
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
