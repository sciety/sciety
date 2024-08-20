import { Logger } from '../logger';
import { Queries } from '../read-models';
import { ExternalQueries, ExternalNotifications } from '../third-parties';
import { DependenciesForCommands } from '../write-side';

export type DependenciesForSagas = Queries
& ExternalQueries
& ExternalNotifications
& DependenciesForCommands
& {
  logger: Logger,
};
