import { Logger } from '../../../infrastructure-contract';
import { Queries } from '../../../read-models';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries & ExternalQueries & {
  logger: Logger,
};
