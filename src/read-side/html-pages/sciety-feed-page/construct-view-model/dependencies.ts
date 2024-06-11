import { Logger } from '../../../../logger';
import { Queries } from '../../../../read-models';
import { GetAllEvents } from '../../../../shared-ports/get-all-events';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
