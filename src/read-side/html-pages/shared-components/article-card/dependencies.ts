import { Logger } from '../../../../logger';
import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';
import { ConstructReviewingGroupsDependencies } from '../../../reviewing-groups';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& ExternalQueries & {
  logger: Logger,
};
