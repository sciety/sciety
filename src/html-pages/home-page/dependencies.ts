import { Queries } from '../../read-models';
import { ConstructGroupLinkWithLogoDependencies } from '../../shared-components/group-link-with-logo';
import { Logger } from '../../shared-ports';

export type Dependencies = Queries & ConstructGroupLinkWithLogoDependencies & {
  logger: Logger,
};
