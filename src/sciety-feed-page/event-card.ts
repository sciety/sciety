import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToListCard,
  scietyFeedCard,
  userFollowedAGroupCard, UserFollowedAGroupCardPorts,
  userSavedArticleToAListCard, UserSavedArticleToAListCardPorts,
} from './cards';
import { collapsedArticlesAddedToListCard } from './cards/collapsed-articles-added-to-list-card';
import {
  CollapsedArticlesAddedToList,
} from './collapse-close-events';
import { isCollapsedArticlesAddedToList } from './collapse-close-list-events';
import {
  DomainEvent,
  isArticleAddedToListEvent, isUserFollowedEditorialCommunityEvent, isUserSavedArticleEvent,
} from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment } from '../types/html-fragment';

export type Ports =
  UserSavedArticleToAListCardPorts
  & UserFollowedAGroupCardPorts;

export const eventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): TE.TaskEither<DE.DataError, HtmlFragment> => {
  if (isUserSavedArticleEvent(event)) {
    return pipe(
      event,
      userSavedArticleToAListCard(ports),
      TE.map(scietyFeedCard),
    );
  }

  if (isUserFollowedEditorialCommunityEvent(event)) {
    return pipe(
      event,
      userFollowedAGroupCard(ports),
      TE.map(scietyFeedCard),
    );
  }

  if (isArticleAddedToListEvent(event)) {
    return pipe(
      event,
      articleAddedToListCard(ports),
      TE.map(scietyFeedCard),
    );
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return pipe(
      event,
      collapsedArticlesAddedToListCard(ports),
      TE.map(scietyFeedCard),
    );
  }

  return TE.left(DE.unavailable);
};
