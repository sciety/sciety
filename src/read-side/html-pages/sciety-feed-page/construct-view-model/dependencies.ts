/**
 * @deprecated html-page dependencies should use Queries rather than GetAllEvents
 */
import { GetAllEvents } from '../../../../event-store';
import { Logger } from '../../../../logger';
import { Queries } from '../../../../read-models';

export type Dependencies = Queries & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
