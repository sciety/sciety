import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToListCard, ArticleAddedToListCardPorts,
  collapsedArticlesAddedToListCard,
  CollapsedArticlesAddedToListCardPorts,
  scietyFeedCard,
  userFollowedAGroupCard, UserFollowedAGroupCardPorts,
} from './cards';
import {
  CollapsedArticlesAddedToList,
  isCollapsedArticlesAddedToList,
} from './feed-item';
import {
  DomainEvent,
  isArticleAddedToListEvent, isUserFollowedEditorialCommunityEvent,
} from '../../domain-events';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports =
  UserFollowedAGroupCardPorts
  & ArticleAddedToListCardPorts
  & CollapsedArticlesAddedToListCardPorts;

export const eventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): O.Option<HtmlFragment> => {
  if (isUserFollowedEditorialCommunityEvent(event)) {
    return pipe(
      event,
      userFollowedAGroupCard(ports),
      O.map(scietyFeedCard),
    );
  }

  if (isArticleAddedToListEvent(event)) {
    return pipe(
      event,
      articleAddedToListCard(ports),
      O.map(scietyFeedCard),
    );
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return pipe(
      event,
      collapsedArticlesAddedToListCard(ports),
      O.map(scietyFeedCard),
    );
  }

  return O.none;
};
