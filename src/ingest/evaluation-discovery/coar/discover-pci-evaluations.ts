/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DiscoverPublishedEvaluations } from '../../discover-published-evaluations';

const transformCoarNotificationUriToAnnouncementActionUri = (uri: string) => TE.right('');

export const discoverPciEvaluations: DiscoverPublishedEvaluations = () => (
  dependencies,
) => pipe(
  'https://inbox-sciety-prod.elifesciences.org/inbox/urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
  transformCoarNotificationUriToAnnouncementActionUri,
  TE.map(() => ({
    understood: [],
    skipped: [],
  })),
);
