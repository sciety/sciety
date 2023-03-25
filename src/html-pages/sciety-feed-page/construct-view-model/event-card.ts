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
import { HtmlFragment } from '../../../types/html-fragment';
import { userFollowedAGroupCard, Ports as UserFollowedAGroupCardPorts } from './user-followed-a-group-card';
import { renderScietyFeedCard } from '../render-as-html/render-sciety-feed-card';
import { articleAddedToListCard, Ports as ArticleAddedToListCardPorts } from './article-added-to-list-card';
import { collapsedArticlesAddedToListCard, Ports as CollapsedArticlesAddedToListCardPorts } from './collapsed-articles-added-to-list-card';

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
      O.map(renderScietyFeedCard),
    );
  }

  if (isArticleAddedToListEvent(event)) {
    return pipe(
      event,
      articleAddedToListCard(ports),
      O.map(renderScietyFeedCard),
    );
  }

  if (isCollapsedArticlesAddedToList(event)) {
    return pipe(
      event,
      collapsedArticlesAddedToListCard(ports),
      O.map(renderScietyFeedCard),
    );
  }

  return O.none;
};
