import { Logger } from '../logger';
import { Queries } from '../read-models';
import { DependenciesForCommands } from '../write-side';

type Dependencies = Queries & DependenciesForCommands & {
  logger: Logger,
};

export const populateAcmiUniqueEvaluatedArticlesList = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'populateAcmiUniqueEvaluatedArticlesList started');
  dependencies.logger('info', 'populateAcmiUniqueEvaluatedArticlesList finished');
};
