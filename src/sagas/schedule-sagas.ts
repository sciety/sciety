import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { DependenciesForSagas } from './dependencies-for-sagas';
import { ensureDeliveryOfNotificationsToCoarInboxes } from './ensure-delivery-of-notifications-to-coar-inboxes';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { runPeriodically } from './run-periodically';

export const scheduleSagas = (
  dependencies: DependenciesForSagas,
  scietyUiOrigin: URL,
): T.Task<void> => async () => {
  if (process.env.DISABLE_SAGAS === 'true') {
    return;
  }
  dependencies.logger('info', 'Scheduling sagas');
  runPeriodically(dependencies.logger, ensureEvaluationsAreListed(dependencies), 317);
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    runPeriodically(dependencies.logger, maintainSnapshotsForEvaluatedExpressions(dependencies), 5);
  }
  if (process.env.COAR_NOTIFICATION_DELIVERY_ENABLED === 'true') {
    runPeriodically(
      dependencies.logger,
      ensureDeliveryOfNotificationsToCoarInboxes(dependencies, scietyUiOrigin),
      5,
    );
  }
  dependencies.logger('info', 'Sagas scheduled');
};
