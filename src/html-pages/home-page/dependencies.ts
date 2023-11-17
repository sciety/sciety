import { Queries } from '../../read-models/index.js';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link/index.js';
import { Logger } from '../../shared-ports/index.js';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
