import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  CollapsedArticlesAddedToList,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import {
  DomainEvent,
  isArticleAddedToListEvent, isUserFollowedEditorialCommunityEvent,
} from '../../../domain-events';
import { userFollowedAGroupCard, Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { articleAddedToListCard, Ports as ArticleAddedToListCardPorts } from './article-added-to-list-card';
import { collapsedArticlesAddedToListCard, Ports as CollapsedArticlesAddedToListCardPorts } from './collapsed-articles-added-to-list-card';
import { ScietyFeedCard } from '../view-model';

export type Ports =
  UserFollowedAGroupCardPorts
  & ArticleAddedToListCardPorts
  & CollapsedArticlesAddedToListCardPorts;

export const eventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): O.Option<ScietyFeedCard> => {
  if (isUserFollowedEditorialCommunityEvent(event)) {
    return pipe(
      event,
      userFollowedAGroupCard(ports),
    );
  }

  if (isArticleAddedToListEvent(event)) {
    return pipe(
      event,
      articleAddedToListCard(ports),
    );
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return pipe(
      event,
      collapsedArticlesAddedToListCard(ports),
    );
  }

  return O.none;
};
