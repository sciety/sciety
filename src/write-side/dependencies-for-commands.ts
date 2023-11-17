import { CommitEvents, GetAllEvents } from '../shared-ports/index.js';

export type DependenciesForCommands = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};
