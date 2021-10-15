import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import {
  groupEvaluatedArticleCard,
  GroupEvaluatedArticleCard,
  GroupEvaluatedArticleCardPorts,
  groupEvaluatedMultipleArticlesCard,
  GroupEvaluatedMultipleArticlesCard,
  GroupEvaluatedMultipleArticlesCardPorts,
  userFollowedAGroupCard,
  UserFollowedAGroupCardPorts,
  userSavedArticleToAListCard,
  UserSavedArticleToAListCardPorts,
} from './cards';

import { ScietyFeedCard } from './cards/sciety-feed-card';
import {
  GroupEvaluatedArticleEvent,
  UserFollowedEditorialCommunityEvent,
  UserSavedArticleEvent,
} from '../domain-events';
import * as DE from '../types/data-error';

export type Ports =
  UserSavedArticleToAListCardPorts
  & GroupEvaluatedArticleCardPorts
  & GroupEvaluatedMultipleArticlesCardPorts
  & UserFollowedAGroupCardPorts;

export type CollapsedGroupEvaluatedArticle = GroupEvaluatedArticleCard & {
  type: 'CollapsedGroupEvaluatedArticle',
};

export type CollapsedGroupEvaluatedMultipleArticles = GroupEvaluatedMultipleArticlesCard & {
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
): TE.TaskEither<DE.DataError, ScietyFeedCard> => pipe(
  match(event)
    .with({ type: 'UserSavedArticle' }, userSavedArticleToAListCard(ports))
    .with({ type: 'UserFollowedEditorialCommunity' }, userFollowedAGroupCard(ports))
    .with({ type: 'GroupEvaluatedArticle' }, groupEvaluatedArticleCard(ports))
    .with({ type: 'CollapsedGroupEvaluatedArticle' }, groupEvaluatedArticleCard(ports))
    .with({ type: 'CollapsedGroupEvaluatedMultipleArticles' }, groupEvaluatedMultipleArticlesCard(ports))
    .otherwise(() => TE.left(DE.unavailable)),
);
