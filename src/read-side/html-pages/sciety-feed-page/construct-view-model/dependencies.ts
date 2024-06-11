import { GetAllEvents } from '../../../../event-store/get-all-events';
import { Logger } from '../../../../logger';
import { Queries } from '../../../../read-models';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
