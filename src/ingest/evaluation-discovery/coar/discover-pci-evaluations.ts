import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { retrieveReviewActionsFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import {
  transformCoarNotificationUriToAnnouncementActionUri,
} from './transform-coar-notification-uri-to-announcement-action-uri';
import { Dependencies, DiscoverPublishedEvaluations } from '../../discover-published-evaluations';
import { constructPublishedEvaluation } from '../../types/published-evaluation';
import { decodeAndReportFailures } from '../decode-and-report-failures';

const retrieveNotificationsFromCoar = (dependencies: Dependencies, originId?: string) => <A>(value: A) => pipe(
  'https://inbox-sciety-prod.elifesciences.org/notification_states/?read=false',
  dependencies.fetchData<JSON>,
  TE.flatMapEither(decodeAndReportFailures(t.array(t.string))),
  TE.flatMap((notificationIds) => pipe(
    notificationIds,
    RA.map((notificationId) => pipe(
      transformCoarNotificationUriToAnnouncementActionUri(dependencies, originId)(`https://inbox-sciety-prod.elifesciences.org/inbox/${notificationId}`),
      TE.map(() => notificationId),
    )),
    RA.map(TE.match(
      () => O.none,
      O.some,
    )),
    T.sequenceSeqArray,
    T.map(RA.compact),
    TE.fromTask,
  )),
  TE.map(() => value),
);

const transformNotificationToReviewActions = (dependencies: Dependencies) => (notification: string) => pipe(
  `https://inbox-sciety-prod.elifesciences.org/inbox/${notification}`,
  transformCoarNotificationUriToAnnouncementActionUri(dependencies),
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
  hardcodedCoarNotificationsConfiguration[groupIdentification],
  TE.traverseArray(transformNotificationToReviewActions(dependencies)),
  TE.map(RA.flatten),
  TE.flatMap(retrieveNotificationsFromCoar(dependencies, groupIdentification)),
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
