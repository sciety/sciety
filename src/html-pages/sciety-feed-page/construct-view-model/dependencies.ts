import { GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../read-models';
import { Logger } from '../../../infrastructure-contract';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
