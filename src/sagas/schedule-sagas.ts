import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { DependenciesForSagas } from './dependencies-for-sagas';
import { ensureDeliveryOfNotificationsToCoarInboxes } from './ensure-delivery-of-notifications-to-coar-inboxes';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import {
  maintainSnapshotsForEvaluatedExpressions,
} from './maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';

type Saga = () => Promise<void>;

const runPeriodically = (saga: Saga, seconds: number): void => {
  setInterval(saga, seconds * 1000);
};

export const scheduleSagas = (
  dependencies: DependenciesForSagas,
  scietyUiOrigin: URL,
): T.Task<void> => async () => {
  if (process.env.DISABLE_SAGAS === 'true') {
    return;
  }
  dependencies.logger('info', 'Scheduling sagas');
  runPeriodically(async () => ensureEvaluationsAreListed(dependencies), 317);
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    runPeriodically(async () => maintainSnapshotsForEvaluatedExpressions(dependencies), 5);
  }
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    runPeriodically(async () => ensureDeliveryOfNotificationsToCoarInboxes(dependencies, scietyUiOrigin), 5);
  }
  dependencies.logger('info', 'Sagas scheduled');
};
