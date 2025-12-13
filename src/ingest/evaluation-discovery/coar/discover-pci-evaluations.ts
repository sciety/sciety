import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as Str from 'fp-ts/string';
import * as t from 'io-ts';
import { retrieveReviewActionsFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { Dependencies, DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const transformNotificationToReviewActions = (
  dependencies: Dependencies,
  originId?: string,
) => (notification: string) => pipe(
  `https://inbox-sciety-prod.elifesciences.org/inbox/${notification}`,
  transformCoarNotificationUriToAnnouncementActionUri(dependencies, originId),
  TE.flatMap(transformAnnouncementActionUriToSignpostingDocmapUri(dependencies)),
  TE.flatMap(retrieveReviewActionsFromDocmap(dependencies)),
);

const hardcodedCoarNotificationsConfiguration: Record<string, ReadonlyArray<string>> = {
  'https://evolbiol.peercommunityin.org/coar_notify/': [
    'urn:uuid:0964db9c-c988-4185-891e-0c8a5c79adb9',
    'urn:uuid:13add01f-61b3-4df5-bc7f-ad4ad9fe64f8',
  ],
  'https://neuro.peercommunityin.org/coar_notify/': [
    'urn:uuid:6d59e586-5c75-417c-ae15-6abdd8030539',
    'urn:uuid:bf3513ee-1fef-4f30-a61b-20721b505f11',
  ],
};

export const discoverPciEvaluations = (groupIdentification: string): DiscoverPublishedEvaluations => () => (
  dependencies,
) => pipe(
  'https://inbox-sciety-prod.elifesciences.org/notification_states/?read=false',
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(t.array(t.string))),
  TE.map((notifications) => pipe(
    hardcodedCoarNotificationsConfiguration[groupIdentification] ?? [],
    RA.concat(notifications),
    RA.uniq(Str.Eq),
  )),
  TE.map(RA.map(transformNotificationToReviewActions(dependencies, groupIdentification))),
  TE.map(RA.map(TE.match(
    () => O.none,
    O.some,
  ))),
  TE.flatMap(TE.traverseArray(TE.fromTask)),
  TE.map(RA.compact),
  TE.map(RA.flatten),
  TE.map(RA.map((reviewAction) => constructPublishedEvaluation({
    publishedOn: new Date(reviewAction.actionOutputDate),
    paperExpressionDoi: reviewAction.actionInputDoi,
    evaluationLocator: `doi:${reviewAction.actionOutputDoi}`,
  }))),
  TE.map((publishedEvaluations) => ({
    understood: publishedEvaluations,
    skipped: [],
  })),
);
