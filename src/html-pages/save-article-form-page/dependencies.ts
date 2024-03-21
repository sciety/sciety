import { Queries } from '../../read-models';
import { Logger } from '../../infrastructure-contract';
import { ExternalQueries } from '../../third-parties';

export type Dependencies = Queries & ExternalQueries & {
  logger: Logger,
};
