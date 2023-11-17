import { GetAllEvents, Logger } from '../../../shared-ports/index.js';
import { Queries } from '../../../read-models/index.js';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
