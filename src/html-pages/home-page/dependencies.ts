import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';

export type Dependencies = Queries & {
  logger: Logger,
};
