import { addArticleToElifeSubjectAreaList, discoverElifeArticleSubjectArea } from '../add-article-to-elife-subject-area-list';
import { CollectedPorts } from '../infrastructure';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed/ensure-evaluations-are-listed';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 661 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 13 * 60 * 1000);
  setInterval(async () => ensureEvaluationsAreListed(ports), 3601 * 1000);
  ports.logger('info', 'Sagas started');
};
