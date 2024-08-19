import { v4 as uuidV4 } from 'uuid';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { DependenciesForCommands } from '../../write-side';

type Dependencies = DependenciesForViews & DependenciesForCommands;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};
