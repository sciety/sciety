import { Queries } from '../../../../read-models';
import { GetAllEvents, Logger } from '../../../../shared-ports';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
