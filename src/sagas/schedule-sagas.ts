import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { DependenciesForSagas } from './dependencies-for-sagas';
import { ensureDeliveryOfNotificationsToCoarInboxes } from './ensure-delivery-of-notifications-to-coar-inboxes';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { runPeriodically } from './run-periodically';
import { EnvironmentVariables } from '../environment-variables';

export const scheduleSagas = (
  dependencies: DependenciesForSagas,
  env: EnvironmentVariables,
  scietyUiOrigin: URL,
): T.Task<void> => async () => {
  if (process.env.DISABLE_SAGAS === 'true') {
    return;
  }
  dependencies.logger('info', 'Scheduling sagas');
  runPeriodically(dependencies.logger, ensureEvaluationsAreListed(dependencies), 317);
  runPeriodically(dependencies.logger, maintainSnapshotsForEvaluatedExpressions(dependencies), 61);
  if (env.COAR_NOTIFICATION_DELIVERY_ENABLED) {
    runPeriodically(
      dependencies.logger,
      ensureDeliveryOfNotificationsToCoarInboxes(dependencies, scietyUiOrigin),
      5,
    );
  }
  dependencies.logger('info', 'Sagas scheduled');
};
