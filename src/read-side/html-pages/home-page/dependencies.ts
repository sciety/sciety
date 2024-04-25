import { ConstructGroupLinkDependencies } from '../../../html-pages/shared-components/group-link';
import { Queries } from '../../../read-models';
import { Logger } from '../../../shared-ports';

export type Dependencies = Queries & ConstructGroupLinkDependencies & {
  logger: Logger,
};
