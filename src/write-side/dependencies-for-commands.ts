import { CommitEvents, GetAllEvents } from '../shared-ports';

export type DependenciesForCommands = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};
