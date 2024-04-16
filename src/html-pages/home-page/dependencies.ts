import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { ConstructGroupLinkDependencies } from '../shared-components/group-link';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
