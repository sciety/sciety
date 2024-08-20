import { Logger } from '../logger';
import { Queries } from '../read-models';
import { ExternalQueries } from '../third-parties';
import { SendCoarNotification } from '../third-parties/send-coar-notification/send-coar-notification';
import { DependenciesForCommands } from '../write-side';

export type DependenciesForSagas = Queries
& ExternalQueries
& DependenciesForCommands
& {
  logger: Logger,
}
& {
  sendCoarNotification: SendCoarNotification,
};
