import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { retrieveReviewActionFromDocmap } from './retrieve-review-action-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';

export const discoverPciEvaluations: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  'https://inbox-sciety-prod.elifesciences.org/inbox/urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
  transformCoarNotificationUriToAnnouncementActionUri(dependencies),
  TE.chain(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies)),
  TE.chain(retrieveReviewActionFromDocmap(dependencies)),
  TE.map((decodedResponse) => constructPublishedEvaluation({
    publishedOn: new Date(decodedResponse.actionOutputDate),
    paperExpressionDoi: decodedResponse.actionInputDoi,
    evaluationLocator: `doi:${decodedResponse.actionOutputDoi}`,
  })),
  TE.map((publishedEvaluation) => ({
    understood: [publishedEvaluation],
    skipped: [],
  })),
);
