import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import match from 'ts-guard-match';
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
  match(event)
    .when(isGroupEvaluatedArticleEvent, groupEvaluatedArticleCard(ports))
    .when(isCollapsedGroupEvaluatedArticle, groupEvaluatedArticleCard(ports))
    .when(isCollapsedGroupEvaluatedMultipleArticles, groupEvaluatedMultipleArticlesCard(ports))
    .when(isUserSavedArticleEvent, userSavedArticleToAListCard(ports))
    .when(isUserFollowedEditorialCommunityEvent, userFollowedAGroupCard(ports))
    .run(),
  TE.bimap(
    () => DE.unavailable,
    scietyFeedCard,
  ),
);
