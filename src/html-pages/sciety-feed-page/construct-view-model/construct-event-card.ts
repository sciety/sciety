import * as O from 'fp-ts/Option';
import {
  CollapsedArticlesAddedToList, isArticleAddedToListEvent,
  isCollapsedArticlesAddedToList,
} from './feed-item.js';
import { userFollowedAGroupCard } from './user-followed-a-group-card.js';
import { articleAddedToListCard } from './article-added-to-list-card.js';
import { collapsedArticlesAddedToListCard } from './collapsed-articles-added-to-list-card.js';
import { ScietyFeedCard } from '../view-model.js';
import { DomainEvent, isEventOfType } from '../../../domain-events/index.js';
import { Dependencies } from './dependencies.js';

export const constructEventCard = (
  dependencies: Dependencies,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): O.Option<ScietyFeedCard> => {
  if (isCollapsedArticlesAddedToList(event)) {
    return collapsedArticlesAddedToListCard(dependencies)(event);
  }
  if (isEventOfType('UserFollowedEditorialCommunity')(event)) {
    return userFollowedAGroupCard(dependencies)(event);
  }
  if (isArticleAddedToListEvent(event)) {
    return articleAddedToListCard(dependencies)(event);
  }
  return O.none;
};
