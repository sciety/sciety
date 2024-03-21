import { Queries } from '../../read-models';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';
import { Logger } from '../../infrastructure-contract';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
