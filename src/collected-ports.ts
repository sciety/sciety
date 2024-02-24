import { SharedPorts } from './shared-ports/index.js';
import { Queries } from './read-models/index.js';
import { CommandHandlers } from './write-side/command-handlers/index.js';
import { Logger } from './infrastructure/logger/index.js';

export type CollectedPorts = SharedPorts & Queries & CommandHandlers & { logger: Logger };
