import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import {
  FetchArticle,
  GetUserDetails,
  groupEvaluatedArticleCard,
  groupEvaluatedMultipleArticlesCard,
  scietyFeedCard,
  userFollowedAGroupCard,
  userSavedArticleToAListCard,
} from './cards';
import {
  CollapsedEvent,
  isCollapsedGroupEvaluatedArticle,
  isCollapsedGroupEvaluatedMultipleArticles,
} from './collapse-close-events';
import { DomainEvent, isGroupEvaluatedArticleEvent, isUserSavedArticleEvent } from '../domain-events';
import { isUserFollowedEditorialCommunityEvent } from '../domain-events/type-guards';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment } from '../types/html-fragment';

export type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

type Ports = {
  getGroup: GetGroup,
  fetchArticle: FetchArticle,
  getUserDetails: GetUserDetails,
};

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

  if (isCollapsedGroupEvaluatedArticle(event) || isGroupEvaluatedArticleEvent(event)) {
    return pipe(
      event,
      groupEvaluatedArticleCard(ports),
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
