import { CommitEvents } from './commit-events';
import { GetAllEvents } from './get-all-events';

export type EventStore = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};
