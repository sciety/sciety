import { URL } from 'url';
import { v4 } from 'uuid';
import { RecordedEvaluation } from './get-recorded-evaluations-for-external-notifications';
import * as paths from '../../read-side/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';

export const constructCoarNotificationModel = (
  recordedEvaluation: RecordedEvaluation,
): CoarNotificationModel => ({
  id: `urn:uuid:${v4()}`,
  objectId: new URL(`https://sciety.org${paths.constructPaperActivityPageFocusedOnEvaluationHref(recordedEvaluation.expressionDoi, recordedEvaluation.evaluationLocator)}`),
  contextId: new URL(`https://sciety.org${paths.constructPaperActivityPageHref(recordedEvaluation.expressionDoi)}`),
  contextCiteAs: new URL(`https://doi.org/${recordedEvaluation.expressionDoi}`),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
});
