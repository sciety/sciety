import { Queries } from '../../../read-models';
import { Logger } from '../../../shared-ports';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../read-side/curation-statements/construct-curation-statements';
import { ConstructReviewingGroupsDependencies } from '../../../shared-components/reviewing-groups';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
