import * as TE from 'fp-ts/TaskEither';
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
} from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment } from '../types/html-fragment';

export type Ports =
  UserFollowedAGroupCardPorts
  & ArticleAddedToListCardPorts
  & CollapsedArticlesAddedToListCardPorts;

export const eventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedArticlesAddedToList,
): TE.TaskEither<DE.DataError, HtmlFragment> => {
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
      TE.fromOption(() => DE.notFound),
      TE.map(scietyFeedCard),
    );
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return pipe(
      event,
      collapsedArticlesAddedToListCard(ports),
      TE.fromOption(() => DE.notFound),
      TE.map(scietyFeedCard),
    );
  }

  return TE.left(DE.unavailable);
};
