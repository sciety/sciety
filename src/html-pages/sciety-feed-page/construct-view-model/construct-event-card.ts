import * as O from 'fp-ts/Option';
import { isEventOfType } from '../../../domain-events/domain-event';
import {
  CollapsedArticlesAddedToList, isArticleAddedToListEvent,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import {
  DomainEvent,
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
  if (isCollapsedArticlesAddedToList(event)) {
    return collapsedArticlesAddedToListCard(ports)(event);
  }
  if (isEventOfType('UserFollowedEditorialCommunity')(event)) {
    return userFollowedAGroupCard(ports)(event);
  }
  if (isArticleAddedToListEvent(event)) {
    return articleAddedToListCard(ports)(event);
  }
  return O.none;
};
