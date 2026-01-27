import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Dependencies } from './dependencies';
import { NotificationDetails, retrieveCoarNotificationsByGroup } from './retrieve-coar-notifications-by-group';
import { retrieveReviewActionsFromDocmap, ReviewActionFromDocmap } from './retrieve-review-actions-from-docmap';
import { transformAnnouncementActionUriToSignpostingDocmapUri } from './transform-announcement-action-uri-to-signposting-docmap-uri';
import { decodeAndReportFailures } from '../legacy/evaluation-discovery/decode-and-report-failures';
import { DiscoveredPublishedEvaluations } from '../types/discovered-published-evaluations';
import { PublishedEvaluation, constructPublishedEvaluation } from '../types/published-evaluation';
import { SkippedEvaluation } from '../types/skipped-evaluation';

const validReviewActionCodec = t.strict({
  actionOutputDoi: t.string,
  actionOutputDate: tt.DateFromISOString,
  actionInputDoi: t.string,
});

const transformNotificationToReviewActions = (
  dependencies: Dependencies,
) => (
  notificationDetails: NotificationDetails,
) => pipe(
  notificationDetails.announcementActionUri,
  transformAnnouncementActionUriToSignpostingDocmapUri(dependencies),
  TE.flatMap(retrieveReviewActionsFromDocmap(dependencies)),
);

const convertToPublishedEvaluation = (
  reviewAction: ReviewActionFromDocmap,
): E.Either<SkippedEvaluation, PublishedEvaluation> => pipe(
  reviewAction,
  decodeAndReportFailures(validReviewActionCodec),
  E.bimap(
    (reason) => ({
      item: `actionInputDoi: ${reviewAction.actionInputDoi}, actionOutputDate: ${reviewAction.actionOutputDate}, actionOutputDoi: ${reviewAction.actionOutputDoi}`,
      reason,
    }),
    (decoded) => constructPublishedEvaluation({
      publishedOn: new Date(decoded.actionOutputDate),
      paperExpressionDoi: decoded.actionInputDoi,
      evaluationLocator: `doi:${decoded.actionOutputDoi}`,
    }),
  ),
);

export const discoverPciEvaluations = (
  dependencies: Dependencies,
) => (groupIdentification: string): TE.TaskEither<string, DiscoveredPublishedEvaluations> => pipe(
  groupIdentification,
  retrieveCoarNotificationsByGroup(dependencies),
  TE.flatMap(TE.traverseArray(transformNotificationToReviewActions(dependencies))),
  TE.map(RA.flatten),
  TE.map(RA.map(convertToPublishedEvaluation)),
  TE.map((evaluations) => ({
    understood: RA.rights(evaluations),
    skipped: RA.lefts(evaluations),
  })),
);
