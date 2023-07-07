import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card';
import { GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Dependencies = Queries & ConstructArticleCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
