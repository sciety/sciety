import { URL } from 'url';
import { v4 } from 'uuid';
import { PendingEvaluation } from './get-pending-evaluations';
import * as paths from '../../standards/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { toDoiUrl } from '../../types/expression-doi';

const scietyUiOrigin = new URL('https://sciety.org');

export const constructCoarNotificationModel = (
  pendingEvaluation: PendingEvaluation,
): CoarNotificationModel => ({
  id: `urn:uuid:${v4()}`,
  objectId: new URL(`${scietyUiOrigin.origin}${paths.constructPaperActivityPageFocusedOnEvaluationHref(pendingEvaluation.expressionDoi, pendingEvaluation.evaluationLocator)}`),
  contextId: new URL(`${scietyUiOrigin.origin}${paths.constructPaperActivityPageHref(pendingEvaluation.expressionDoi)}`),
  contextCiteAs: new URL(toDoiUrl(pendingEvaluation.expressionDoi)),
  targetId: new URL('https://coar-notify-inbox.fly.dev'),
  targetInbox: new URL('https://coar-notify-inbox.fly.dev/inbox/'),
});
