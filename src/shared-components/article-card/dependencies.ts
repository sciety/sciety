import { Queries } from '../../read-models';
import { Ports as GetLatestArticleVersionDatePorts } from './get-latest-article-version-date';
import { Logger } from '../../shared-ports';
import { ConstructReviewingGroupsDependencies } from '../reviewing-groups';
import { ExternalQueries } from '../../third-parties';

export type Dependencies = Queries
& ConstructReviewingGroupsDependencies
& GetLatestArticleVersionDatePorts
& ExternalQueries & {
  logger: Logger,
};
