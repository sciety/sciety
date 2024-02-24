import { GetAllEvents } from '../../../shared-ports/index.js';
import { Queries } from '../../../read-models/index.js';
import { Logger } from '../../../infrastructure/index.js';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
