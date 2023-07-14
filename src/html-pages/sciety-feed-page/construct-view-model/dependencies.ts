import { GetAllEvents, Logger } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
