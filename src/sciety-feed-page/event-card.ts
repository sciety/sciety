import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import {
  groupEvaluatedArticleCard,
  GroupEvaluatedArticleCard, GroupEvaluatedArticleCardPorts,
  groupEvaluatedMultipleArticlesCard,
  GroupEvaluatedMultipleArticlesCard, GroupEvaluatedMultipleArticlesCardPorts,
  scietyFeedCard, userFollowedAGroupCard, UserFollowedAGroupCardPorts,
  userSavedArticleToAListCard, UserSavedArticleToAListCardPorts,
} from './cards';

import {
  GroupEvaluatedArticleEvent,
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

type CollapsedGroupEvaluatedArticle = GroupEvaluatedArticleCard & {
  type: 'CollapsedGroupEvaluatedArticle',
};

type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
  type: 'CollapsedGroupEvaluatedMultipleArticles',
};

export type EventCardModel = (
  UserSavedArticleEvent
  | UserFollowedEditorialCommunityEvent
  | GroupEvaluatedArticleEvent
  | CollapsedGroupEvaluatedArticle
  | CollapsedGroupEvaluatedMultipleArticles
);

export const eventCard = (
  ports: Ports,
) => (
  event: EventCardModel,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  match(event)
    .with({ type: 'UserSavedArticle' }, userSavedArticleToAListCard(ports))
    .with({ type: 'UserFollowedEditorialCommunity' }, userFollowedAGroupCard(ports))
    .with({ type: 'GroupEvaluatedArticle' }, groupEvaluatedArticleCard(ports))
    .with({ type: 'CollapsedGroupEvaluatedArticle' }, groupEvaluatedArticleCard(ports))
    .with({ type: 'CollapsedGroupEvaluatedMultipleArticles' }, groupEvaluatedMultipleArticlesCard(ports))
    .otherwise(() => TE.left(DE.unavailable)),
  TE.map(scietyFeedCard),
);
