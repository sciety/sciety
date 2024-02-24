import { Logger } from '../../infrastructure';
import { Queries } from '../../read-models';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
