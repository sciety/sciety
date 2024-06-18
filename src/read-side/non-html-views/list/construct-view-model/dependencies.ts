import { Logger } from '../../../../logger';
import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';

export type Dependencies = Queries & ExternalQueries & {
  logger: Logger,
};
