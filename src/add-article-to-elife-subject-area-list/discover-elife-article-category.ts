import { Logger } from '../shared-ports';

type Ports = {
  logger: Logger,
};

export const discoverElifeArticleCategory = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleCategory starting');
  ports.logger('info', 'discoverElifeArticleCategory finished');
};
