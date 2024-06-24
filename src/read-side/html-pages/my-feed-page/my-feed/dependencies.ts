/**
 * @deprecated html-page dependencies should use Queries rather than GetAllEvents
 */
import { GetAllEvents } from '../../../../event-store';
import { Queries } from '../../../../read-models';
import { ConstructArticleCardViewModelDependencies } from '../../shared-components/article-card';

export type Dependencies = Queries & ConstructArticleCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
