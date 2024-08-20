import { Logger } from '../logger';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';
import { DependenciesForCommands } from '../write-side';

export type DependenciesForSagas = Queries
& ExternalQueries
& DependenciesForCommands
& {
  logger: Logger,
};
