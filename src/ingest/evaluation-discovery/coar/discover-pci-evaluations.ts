import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { retrieveReviewActionsFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';

export const discoverPciEvaluations: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  ['urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11'],
  RA.map((notification) => `https://inbox-sciety-prod.elifesciences.org/inbox/${notification}`),
  RA.map(transformCoarNotificationUriToAnnouncementActionUri(dependencies)),
  RA.map(TE.chain(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies))),
  RA.map(TE.chain(retrieveReviewActionsFromDocmap(dependencies))),
  RA.map(TE.map(RA.map((reviewAction) => constructPublishedEvaluation({
    publishedOn: new Date(reviewAction.actionOutputDate),
    paperExpressionDoi: reviewAction.actionInputDoi,
    evaluationLocator: `doi:${reviewAction.actionOutputDoi}`,
  })))),
  ([first]) => first,
  TE.map((publishedEvaluation) => ({
    understood: publishedEvaluation,
    skipped: [],
  })),
);
