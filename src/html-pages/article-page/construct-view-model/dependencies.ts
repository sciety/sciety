import { Queries } from '../../../read-models/index.js';
import { Logger } from '../../../shared-ports/index.js';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../shared-components/curation-statements/construct-curation-statements.js';
import { ConstructReviewingGroupsDependencies } from '../../../shared-components/reviewing-groups/index.js';
import { ExternalQueries } from '../../../third-parties/index.js';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
