import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { EventIdFromString } from '../../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import { ReviewIdFromString } from '../../types/codecs/ReviewIdFromString';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';

const userFollowedEditorialCommunityDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFollowedEditorialCommunity'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    editorialCommunityId: GroupIdFromString,
  }),
});

const userUnfollowedEditorialCommunityDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnfollowedEditorialCommunity'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    editorialCommunityId: GroupIdFromString,
  }),
});

const userFoundReviewHelpfulDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewHelpful'),
  date: DateFromISOString,
  payload: t.strict({
    userId: UserIdFromString,
    reviewId: ReviewIdFromString,
  }),
});

const userFoundReviewNotHelpfulDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserFoundReviewNotHelpful'),
  date: DateFromISOString,
  payload: t.strict({
    userId: UserIdFromString,
    reviewId: ReviewIdFromString,
  }),
});

const userRevokedFindingReviewHelpfulDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewHelpful'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    reviewId: ReviewIdFromString,
  }),
});

const userRevokedFindingReviewNotHelpfulDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserRevokedFindingReviewNotHelpful'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    reviewId: ReviewIdFromString,
  }),
});

const userSavedArticleDatabaseEvent = t.type({
  id: EventIdFromString,
  type: t.literal('UserSavedArticle'),
  date: DateFromISOString,
  payload: t.type({
    userId: UserIdFromString,
    articleId: DoiFromString,
  }),
});

const databaseEvent = t.union([
  userFollowedEditorialCommunityDatabaseEvent,
  userUnfollowedEditorialCommunityDatabaseEvent,
  userFoundReviewHelpfulDatabaseEvent,
  userFoundReviewNotHelpfulDatabaseEvent,
  userRevokedFindingReviewHelpfulDatabaseEvent,
  userRevokedFindingReviewNotHelpfulDatabaseEvent,
  userSavedArticleDatabaseEvent,
], 'type');

export const databaseEvents = t.readonlyArray(databaseEvent);
