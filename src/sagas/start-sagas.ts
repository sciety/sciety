import { discoverElifeArticleSubjectArea, addArticleToElifeSubjectAreaList } from '../add-article-to-elife-subject-area-list';
import { CollectedPorts } from '../infrastructure';
import { discoverHypothesisEvaluationType } from './discover-hypothesis-evaluation-type';

export const startSagas = (ports: CollectedPorts) => async (): Promise<void> => {
  ports.logger('info', 'Starting sagas');
  setInterval(async () => discoverElifeArticleSubjectArea(ports), 661 * 1000);
  setInterval(async () => addArticleToElifeSubjectAreaList(ports), 13 * 60 * 1000);
  setInterval(async () => discoverHypothesisEvaluationType(ports), 11 * 1000);
  ports.logger('info', 'Sagas started');
};
