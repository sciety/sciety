/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from 'fp-ts/TaskEither';
import { DiscoverPublishedEvaluations } from '../discover-published-evaluations';

export const discoverEvaluationsFromDocmapsViaCoarNotifications = (

): DiscoverPublishedEvaluations => (
  ingestDays,
) => (
  dependencies,
) => TE.right({
  understood: [],
  skipped: [],
});
