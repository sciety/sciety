import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  GroupEvaluatedArticleCardPorts, groupEvaluatedMultipleArticlesCard,
  GroupEvaluatedMultipleArticlesCardPorts, groupEvaluatedSingleArticleCard,
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
  DomainEvent, isEvaluationRecordedEvent, isUserFollowedEditorialCommunityEvent, isUserSavedArticleEvent,
} from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment } from '../types/html-fragment';

export type Ports =
  UserSavedArticleToAListCardPorts
  & GroupEvaluatedArticleCardPorts
  & GroupEvaluatedMultipleArticlesCardPorts
  & UserFollowedAGroupCardPorts;

export const eventCard = (
  ports: Ports,
) => (
  event: DomainEvent | CollapsedEvent,
): TE.TaskEither<DE.DataError, HtmlFragment> => {
  if (isCollapsedGroupEvaluatedMultipleArticles(event)) {
    return pipe(
      event,
      groupEvaluatedMultipleArticlesCard(ports),
      TE.map(scietyFeedCard),
    );
  }

  if (isCollapsedGroupEvaluatedArticle(event) || isEvaluationRecordedEvent(event)) {
    return pipe(
      event,
      groupEvaluatedSingleArticleCard(ports),
      TE.map(scietyFeedCard),
    );
  }

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

  return TE.left(DE.unavailable);
};
