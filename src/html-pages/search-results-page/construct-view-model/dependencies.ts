import { Queries } from '../../../read-models';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card';
import { ExternalQueries } from '../../../third-parties';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';

export type Dependencies = Queries
& ExternalQueries
& ConstructPaperActivitySummaryCardViewModelDependencies
& ConstructGroupLinkDependencies;
