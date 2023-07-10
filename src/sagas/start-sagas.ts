import { discoverElifeArticleSubjectArea, addArticleToElifeSubjectAreaList } from '../add-article-to-elife-subject-area-list';
import { CollectedPorts } from '../infrastructure';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 661 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 13 * 60 * 1000);
  // setInterval(async () => discoverHypothesisEvaluationType(ports), 10 * 1000);
  ports.logger('info', 'Sagas started');
};
