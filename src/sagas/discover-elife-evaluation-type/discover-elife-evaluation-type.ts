import { Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';

type Dependencies = Queries & {
  logger: Logger,
};

export const discoverElifeEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverElifeEvaluationType starting');
  dependencies.getEvaluationsWithNoType();
  dependencies.logger('info', 'discoverElifeEvaluationType finished');
};
