import { URL } from 'url';
import { v4 } from 'uuid';
import { PendingNotification } from '../../read-models/evaluations-for-notifications';
import * as paths from '../../standards/paths';
import { CoarNotificationModel } from '../../types/coar-notification-model';
import { toDoiUrl } from '../../types/expression-doi';

export const constructCoarNotificationModel = (
  scietyUiOrigin: URL,
) => (
  pendingNotification: PendingNotification,
): CoarNotificationModel => ({
  id: `urn:uuid:${v4()}`,
  objectId: new URL(`${scietyUiOrigin.origin}${paths.constructPaperActivityPageFocusedOnEvaluationHref(pendingNotification.expressionDoi, pendingNotification.evaluationLocator)}`),
  contextId: new URL(`${scietyUiOrigin.origin}${paths.constructPaperActivityPageHref(pendingNotification.expressionDoi)}`),
  contextCiteAs: new URL(toDoiUrl(pendingNotification.expressionDoi)),
  targetId: pendingNotification.targetId,
  targetInbox: pendingNotification.targetInbox,
});
