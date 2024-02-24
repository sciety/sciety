import { Logger } from '../../infrastructure/index.js';
import { Queries } from '../../read-models/index.js';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link/index.js';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
