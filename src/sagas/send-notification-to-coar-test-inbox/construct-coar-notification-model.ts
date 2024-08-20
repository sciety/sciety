import { URL } from 'url';
import { v4 } from 'uuid';
import { PendingEvaluation } from './get-pending-evaluations';
import * as paths from '../../read-side/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { toDoiUrl } from '../../types/expression-doi';

export const constructCoarNotificationModel = (
  pendingEvaluation: PendingEvaluation,
): CoarNotificationModel => ({
  id: `urn:uuid:${v4()}`,
  objectId: new URL(`https://sciety.org${paths.constructPaperActivityPageFocusedOnEvaluationHref(pendingEvaluation.expressionDoi, pendingEvaluation.evaluationLocator)}`),
  contextId: new URL(`https://sciety.org${paths.constructPaperActivityPageHref(pendingEvaluation.expressionDoi)}`),
  contextCiteAs: new URL(toDoiUrl(pendingEvaluation.expressionDoi)),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox'),
});
