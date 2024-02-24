import { Queries } from '../../read-models';
import { Logger } from '../../infrastructure';
import { ConstructReviewingGroupsDependencies } from '../../read-side/reviewing-groups';
import { ExternalQueries } from '../../third-parties';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& ExternalQueries & {
  logger: Logger,
};
