import * as O from 'fp-ts/Option';
import {
  CollapsedArticlesAddedToList, isArticleAddedToListEvent,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import { userFollowedAGroupCard } from './user-followed-a-group-card';
import { articleAddedToListCard } from './article-added-to-list-card';
import { collapsedArticlesAddedToListCard } from './collapsed-articles-added-to-list-card';
import { ScietyFeedCard } from '../view-model';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import { Dependencies } from './dependencies';

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
