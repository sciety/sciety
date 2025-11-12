import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { retrieveActionDoiFromDocmap } from './retrieve-action-doi-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { DiscoverPublishedEvaluations } from '../../discover-published-evaluations';

export const discoverPciEvaluations: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  'https://inbox-sciety-prod.elifesciences.org/inbox/urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
  transformCoarNotificationUriToAnnouncementActionUri(dependencies),
  TE.chain(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies)),
  TE.chain(retrieveActionDoiFromDocmap(dependencies)),
  TE.map(() => ({
    understood: [],
    skipped: [],
  })),
);
