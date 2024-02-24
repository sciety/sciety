import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card/index.js';
import { GetAllEvents } from '../../../shared-ports/index.js';
import { Queries } from '../../../read-models/index.js';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
