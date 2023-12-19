import { Queries } from '../../read-models';
import { Logger } from '../../shared-ports';
import { ConstructReviewingGroupsDependencies } from '../reviewing-groups';
import { ExternalQueries } from '../../third-parties';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& ExternalQueries & {
  logger: Logger,
};
