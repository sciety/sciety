/**
 * @deprecated html-page dependencies should use Queries rather than GetAllEvents
 */
import { GetAllEvents } from '../../../../event-store';
import { Queries } from '../../../../read-models';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
