import { Queries } from '../../../read-models/index.js';
import { Logger } from '../../../infrastructure/index.js';
import { ExternalQueries } from '../../../third-parties/index.js';

export type Dependencies = Queries & ExternalQueries & {
  logger: Logger,
};
