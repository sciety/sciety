import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card/index.js';
import { Queries } from '../../../read-models/index.js';
import { ConstructGroupLinkDependencies } from '../../../shared-components/group-link/index.js';
import { ExternalQueries } from '../../../third-parties/index.js';

export type Dependencies = Queries
& ExternalQueries
& ConstructPaperActivitySummaryCardViewModelDependencies
& ConstructGroupLinkDependencies;
