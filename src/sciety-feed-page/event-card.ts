import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  groupEvaluatedArticleCard, GroupEvaluatedArticleCardPorts,
  groupEvaluatedMultipleArticlesCard, GroupEvaluatedMultipleArticlesCardPorts,
  scietyFeedCard,
  userFollowedAGroupCard, UserFollowedAGroupCardPorts,
  userSavedArticleToAListCard, UserSavedArticleToAListCardPorts,
} from './cards';
import {
  CollapsedEvent,
  isCollapsedGroupEvaluatedArticle,
  isCollapsedGroupEvaluatedMultipleArticles,
} from './collapse-close-events';
import {
  GroupEvaluatedArticleEvent,
  isGroupEvaluatedArticleEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserSavedArticleEvent,
  UserFollowedEditorialCommunityEvent,
  UserSavedArticleEvent,
} from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment } from '../types/html-fragment';

export type Ports =
  UserSavedArticleToAListCardPorts
  & GroupEvaluatedArticleCardPorts
  & GroupEvaluatedMultipleArticlesCardPorts
  & UserFollowedAGroupCardPorts;

export type EventCardEvents = (
  GroupEvaluatedArticleEvent
  | CollapsedEvent
  | UserSavedArticleEvent
  | UserFollowedEditorialCommunityEvent
);

export const eventCard = (
  ports: Ports,
) => (
  event: EventCardEvents,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  event,
  (evnt) => {
    if (isCollapsedGroupEvaluatedMultipleArticles(evnt)) {
      return pipe(
        evnt,
        groupEvaluatedMultipleArticlesCard(ports),
      );
    }

    if (isCollapsedGroupEvaluatedArticle(evnt) || isGroupEvaluatedArticleEvent(evnt)) {
      return pipe(
        evnt,
        groupEvaluatedArticleCard(ports),
      );
    }

    if (isUserSavedArticleEvent(evnt)) {
      return pipe(
        evnt,
        userSavedArticleToAListCard(ports),
      );
    }

    if (isUserFollowedEditorialCommunityEvent(evnt)) {
      return pipe(
        evnt,
        userFollowedAGroupCard(ports),
      );
    }

    return TE.left(DE.unavailable);
  },
  TE.map(scietyFeedCard),
);
