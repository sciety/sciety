import { Queries } from '../../../read-models/index.js';
import { Logger } from '../../../infrastructure/index.js';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../read-side/curation-statements/construct-curation-statements.js';
import { ConstructReviewingGroupsDependencies } from '../../../read-side/reviewing-groups/index.js';
import { ExternalQueries } from '../../../third-parties/index.js';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
