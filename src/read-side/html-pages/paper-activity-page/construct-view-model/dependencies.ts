import { Queries } from '../../../../read-models';
import { Logger } from '../../../../shared-ports';
import { ExternalQueries } from '../../../../third-parties';
import { Dependencies as ConstructCurationStatementsDependencies } from '../../../curation-statements/construct-curation-statements';
import { ConstructReviewingGroupsDependencies } from '../../../reviewing-groups';

export type Dependencies = Queries
& ConstructCurationStatementsDependencies
& ConstructReviewingGroupsDependencies
& ExternalQueries
& {
  logger: Logger,
};
