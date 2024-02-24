import { addArticleToElifeSubjectAreaList } from './add-article-to-elife-subject-area-list';
import { CollectedPorts } from '../collected-ports';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed';
import { discoverElifeArticleSubjectArea } from './discover-elife-article-subject-area';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 307 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 311 * 1000);
  setInterval(async () => ensureEvaluationsAreListed(ports), 317 * 1000);
  ports.logger('info', 'Sagas started');
};
