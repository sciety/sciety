import { GetAllEvents, Logger } from '../../../shared-ports';
import { Queries } from '../../../read-models';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
