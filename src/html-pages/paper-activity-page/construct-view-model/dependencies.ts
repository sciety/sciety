import { Queries } from '../../../read-models';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../read-side/curation-statements/construct-curation-statements';
import { ConstructReviewingGroupsDependencies } from '../../../read-side/reviewing-groups';
import { Logger } from '../../../shared-ports';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
