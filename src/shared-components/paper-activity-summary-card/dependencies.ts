import { Queries } from '../../read-models/index.js';
import { Logger } from '../../infrastructure/index.js';
import { ConstructReviewingGroupsDependencies } from '../../read-side/reviewing-groups/index.js';
import { ExternalQueries } from '../../third-parties/index.js';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& ExternalQueries & {
  logger: Logger,
};
