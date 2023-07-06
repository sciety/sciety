import { Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';

type Dependencies = Queries & {
  logger: Logger,
};

export const discoverHypothesisEvaluationType = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'discoverHypothesisEvaluationType starting');
  dependencies.getEvaluationsWithNoType();
  dependencies.logger('info', 'discoverHypothesisEvaluationType finished');
};
