import { GetAllEvents } from '../../../shared-ports';
import { Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { Ports as ArticleAddedToListCardPorts } from './article-added-to-list-card';
import { Ports as CollapsedArticlesAddedToListCardPorts } from './collapsed-articles-added-to-list-card';

export type Dependencies =
  UserFollowedAGroupCardPorts
  & ArticleAddedToListCardPorts
  & CollapsedArticlesAddedToListCardPorts
  & {
    getAllEvents: GetAllEvents,
  };
