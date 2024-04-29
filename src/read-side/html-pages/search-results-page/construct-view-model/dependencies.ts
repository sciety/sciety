import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries
& ExternalQueries
& ConstructPaperActivitySummaryCardViewModelDependencies
& ConstructGroupLinkDependencies;
