import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card/index.js';
import { GetAllEvents } from '../../../shared-ports/index.js';
import { Queries } from '../../../read-models/index.js';

export type Dependencies = Queries & ConstructArticleCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
