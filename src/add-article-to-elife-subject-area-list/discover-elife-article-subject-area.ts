import { Logger, RecordSubjectArea } from '../shared-ports';
import { Doi } from '../types/doi';

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};

export const discoverElifeArticleSubjectArea = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleSubjectArea starting');
  ports.recordSubjectArea({
    articleId: new Doi('10.1101/1234'),
    subjectArea: {
      value: 'something',
      server: 'biorxiv',
    },
  });
  ports.logger('info', 'discoverElifeArticleSubjectArea finished');
};
