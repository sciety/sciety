import { Ports as OwnedByPorts } from './owned-by';
import { Logger } from '../infrastructure/logger';

type LowLevelPorts = {
  logger: Logger,
};

export type Ports = OwnedByPorts & LowLevelPorts;
