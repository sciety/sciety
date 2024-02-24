import { addArticleToElifeSubjectAreaList } from './add-article-to-elife-subject-area-list/index.js';
import { CollectedPorts } from '../collected-ports.js';
import { ensureEvaluationsAreListed } from './ensure-evaluations-are-listed/index.js';
import { discoverElifeArticleSubjectArea } from './discover-elife-article-subject-area/index.js';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 307 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 311 * 1000);
  setInterval(async () => ensureEvaluationsAreListed(ports), 317 * 1000);
  ports.logger('info', 'Sagas started');
};
