import * as O from 'fp-ts/Option';
import {
  CollapsedArticlesAddedToList, isArticleAddedToListEvent,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
} from '../../../domain-events';
import { userFollowedAGroupCard, Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { articleAddedToListCard, Ports as ArticleAddedToListCardPorts } from './article-added-to-list-card';
import { collapsedArticlesAddedToListCard, Ports as CollapsedArticlesAddedToListCardPorts } from './collapsed-articles-added-to-list-card';
import { ScietyFeedCard } from '../view-model';

export type Ports =
  UserFollowedAGroupCardPorts
  & ArticleAddedToListCardPorts
  & CollapsedArticlesAddedToListCardPorts;

export const constructEventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): O.Option<ScietyFeedCard> => {
  if (isUserFollowedEditorialCommunityEvent(event)) {
    return userFollowedAGroupCard(ports)(event);
  }

  if (isArticleAddedToListEvent(event)) {
    return articleAddedToListCard(ports)(event);
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return collapsedArticlesAddedToListCard(ports)(event);
  }

  return O.none;
};
