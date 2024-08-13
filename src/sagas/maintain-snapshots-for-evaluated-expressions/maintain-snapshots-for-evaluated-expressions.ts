import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { DependenciesForCommands } from '../../write-side';

type Dependencies = DependenciesForViews & DependenciesForCommands;

export const maintainSnapshotsForEvaluatedExpressions = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dependencies: Dependencies,
): Promise<void> => undefined;
