import { Queries } from '../../../read-models';
import { Logger } from '../../../infrastructure-contract';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../read-side/curation-statements/construct-curation-statements';
import { ConstructReviewingGroupsDependencies } from '../../../read-side/reviewing-groups';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
