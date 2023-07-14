import { GetAllEvents, Logger } from '../../../shared-ports';
import { Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { Queries } from '../../../shared-read-models';

export type Dependencies = Queries & UserFollowedAGroupCardPorts & {
  getAllEvents: GetAllEvents,
  logger: Logger,
};
