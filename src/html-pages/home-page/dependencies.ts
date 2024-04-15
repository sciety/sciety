import { Queries } from '../../read-models';
import { ConstructGroupLinkDependencies } from '../shared-components/group-link';
import { Logger } from '../../shared-ports';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
