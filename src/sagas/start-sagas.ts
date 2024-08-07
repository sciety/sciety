import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import { populateAcmiUniqueEvaluatedArticlesList } from './populate-acmi-unique-evaluated-articles-list';
import { CollectedPorts } from '../infrastructure';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => ensureEvaluationsAreListed(ports), 317 * 1000);
  setInterval(async () => populateAcmiUniqueEvaluatedArticlesList(ports), 23 * 1000);
  ports.logger('info', 'Sagas started');
};
