import { Queries } from '../../../read-models';
import { ConstructGroupLinkDependencies } from '../../../read-side/html-pages/shared-components/group-link';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../read-side/html-pages/shared-components/paper-activity-summary-card';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ExternalQueries
& ConstructPaperActivitySummaryCardViewModelDependencies
& ConstructGroupLinkDependencies;
