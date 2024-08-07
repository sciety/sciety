import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import { CollectedPorts } from '../infrastructure';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => ensureEvaluationsAreListed(ports), 317 * 1000);
  ports.logger('info', 'Sagas started');
};
