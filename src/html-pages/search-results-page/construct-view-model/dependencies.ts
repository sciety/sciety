import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card';
import { Queries } from '../../../read-models';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ExternalQueries
& ConstructPaperActivitySummaryCardViewModelDependencies
& ConstructGroupLinkDependencies;
