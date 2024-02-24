import { SharedPorts } from './shared-ports';
import { Queries } from './read-models';
import { CommandHandlers } from './write-side/command-handlers';
import { Logger } from './infrastructure/logger';

export type CollectedPorts = SharedPorts & Queries & CommandHandlers & { logger: Logger };
