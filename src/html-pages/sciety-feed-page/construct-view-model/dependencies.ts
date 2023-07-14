import { Ports as EventCardDependencies } from './construct-event-card';
import { GetAllEvents } from '../../../shared-ports';

export type Dependencies = EventCardDependencies & {
  getAllEvents: GetAllEvents,
};
