import { DependenciesForSagas } from './dependencies-for-sagas';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { sendNotificationToCoarTestInbox } from './send-notification-to-coar-test-inbox';

export const startSagas = (dependencies: DependenciesForSagas) => async (): Promise<void> => {
  dependencies.logger('info', 'Starting sagas');
  setInterval(async () => ensureEvaluationsAreListed(dependencies), 317 * 1000);
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    setInterval(async () => maintainSnapshotsForEvaluatedExpressions(dependencies), 5 * 1000);
  }
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    setTimeout(async () => sendNotificationToCoarTestInbox(dependencies), 5 * 1000);
  }
  dependencies.logger('info', 'Sagas started');
};
