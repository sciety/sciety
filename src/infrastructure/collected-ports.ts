import { SharedPorts } from '../shared-ports/index.js';
import { Queries } from '../read-models/index.js';
import { CommandHandlers } from '../write-side/command-handlers.js';

export type CollectedPorts = SharedPorts & Queries & CommandHandlers;
