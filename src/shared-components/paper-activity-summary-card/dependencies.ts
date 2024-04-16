import { Queries } from '../../read-models';
import { ConstructReviewingGroupsDependencies } from '../../read-side/reviewing-groups';
import { Logger } from '../../shared-ports';
import { ExternalQueries } from '../../third-parties';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& ExternalQueries & {
  logger: Logger,
};
