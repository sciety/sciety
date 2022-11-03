import { Logger, RecordSubjectArea } from '../shared-ports';

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};

export const discoverElifeArticleSubjectArea = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleSubjectArea starting');
  ports.logger('info', 'discoverElifeArticleSubjectArea finished');
};
