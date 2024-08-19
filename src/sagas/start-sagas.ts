import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { sendNotificationToCoarTestInbox } from './send-notification-to-coar-test-inbox';
import { CollectedPorts } from '../infrastructure';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => ensureEvaluationsAreListed(ports), 317 * 1000);
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    setInterval(async () => maintainSnapshotsForEvaluatedExpressions(ports), 5 * 1000);
  }
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    setTimeout(async () => sendNotificationToCoarTestInbox(ports), 5 * 1000);
  }
  ports.logger('info', 'Sagas started');
};
