import * as O from 'fp-ts/Option';
import {
  CollapsedArticlesAddedToList, isArticleAddedToListEvent,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import { userFollowedAGroupCard, Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { articleAddedToListCard, Ports as ArticleAddedToListCardPorts } from './article-added-to-list-card';
import { collapsedArticlesAddedToListCard, Ports as CollapsedArticlesAddedToListCardPorts } from './collapsed-articles-added-to-list-card';
import { ScietyFeedCard } from '../view-model';
import { DomainEvent, isEventOfType } from '../../../domain-events';

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
