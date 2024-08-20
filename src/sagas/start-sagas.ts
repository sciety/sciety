import { DependenciesForSagas } from './dependencies-for-sagas';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { sendNotificationToCoarTestInbox } from './send-notification-to-coar-test-inbox';

type Saga = () => Promise<void>;

const runPeriodically = (saga: Saga, seconds: number): void => {
  setInterval(saga, seconds * 1000);
};

const runOnceAfter = (saga: Saga, seconds: number): void => {
  setTimeout(saga, seconds * 1000);
};

export const startSagas = (dependencies: DependenciesForSagas) => async (): Promise<void> => {
  dependencies.logger('info', 'Starting sagas');
  runPeriodically(async () => ensureEvaluationsAreListed(dependencies), 317);
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    runPeriodically(async () => maintainSnapshotsForEvaluatedExpressions(dependencies), 5);
  }
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    runOnceAfter(async () => sendNotificationToCoarTestInbox(dependencies), 5);
  }
  dependencies.logger('info', 'Sagas started');
};
