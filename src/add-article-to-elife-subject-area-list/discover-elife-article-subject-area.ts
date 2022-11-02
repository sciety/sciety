import { Logger } from '../shared-ports';

type Ports = {
  logger: Logger,
};

export const discoverElifeArticleSubjectArea = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleSubjectArea starting');
  ports.logger('info', 'discoverElifeArticleSubjectArea finished');
};
