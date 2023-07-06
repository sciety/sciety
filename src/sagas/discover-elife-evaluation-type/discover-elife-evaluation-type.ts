import { Logger } from '../../shared-ports';

type Dependencies = {
  logger: Logger,
};

export const discoverElifeEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverElifeEvaluationType starting');
  dependencies.logger('info', 'discoverElifeEvaluationType finished');
};
