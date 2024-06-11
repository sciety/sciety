import { GetAllEvents } from '../../../../event-store/get-all-events';
import { Queries } from '../../../../read-models';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
