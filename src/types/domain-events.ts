import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import { Doi } from './doi';
import { EventId, generate } from './event-id';
import { GroupId } from './group-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type EditorialCommunityReviewedArticleEvent = Readonly<{
  type: 'EditorialCommunityReviewedArticle',
  date: Date,
  editorialCommunityId: GroupId,
  articleId: Doi,
  reviewId: ReviewId,
}>;

export const isEditorialCommunityReviewedArticleEvent = (event: DomainEvent):
event is EditorialCommunityReviewedArticleEvent => (
  event.type === 'EditorialCommunityReviewedArticle'
);

export const editorialCommunityReviewedArticle = (
  editorialCommunityId: GroupId,
  doi: Doi,
  reviewId: ReviewId,
  date: Date = new Date(),
): EditorialCommunityReviewedArticleEvent => ({
  type: 'EditorialCommunityReviewedArticle',
  date,
  editorialCommunityId,
  articleId: doi,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserFollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserFollowedEditorialCommunity',
  date: Date,
  userId: UserId,
  editorialCommunityId: GroupId,
}>;

export const userFollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
): UserFollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserFollowedEditorialCommunity',
  date: new Date(),
  userId,
  editorialCommunityId,
});

export const isUserFollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserFollowedEditorialCommunityEvent => (
  event.type === 'UserFollowedEditorialCommunity'
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserUnfollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserUnfollowedEditorialCommunity',
  date: Date,
  userId: UserId,
  editorialCommunityId: GroupId,
}>;

export const userUnfollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: GroupId,
): UserUnfollowedEditorialCommunityEvent => ({
  id: generate(),
  type: 'UserUnfollowedEditorialCommunity',
  date: new Date(),
  userId,
  editorialCommunityId,
});

export const isUserUnfollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserUnfollowedEditorialCommunityEvent => (
  event.type === 'UserUnfollowedEditorialCommunity'
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserFoundReviewHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserFoundReviewHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userFoundReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserRevokedFindingReviewHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserRevokedFindingReviewHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userRevokedFindingReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserFoundReviewNotHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserFoundReviewNotHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userFoundReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserRevokedFindingReviewNotHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserRevokedFindingReviewNotHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userRevokedFindingReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const isUserSavedArticleEvent = (event: DomainEvent):
  event is UserSavedArticleEvent => (
  event.type === 'UserSavedArticle'
);

export type UserSavedArticleEvent = Readonly<{
  id: EventId,
  type: 'UserSavedArticle',
  date: Date,
  userId: UserId,
  articleId: Doi,
}>;

export const userSavedArticle = (userId: UserId, doi: Doi): UserSavedArticleEvent => ({
  id: generate(),
  type: 'UserSavedArticle',
  date: new Date(),
  userId,
  articleId: doi,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type DomainEvent =
  EditorialCommunityReviewedArticleEvent |
  UserSavedArticleEvent |
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserFoundReviewHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent;

export type RuntimeGeneratedEvent =
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent |
  UserFoundReviewHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent |
  UserSavedArticleEvent;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export const byDate: Ord.Ord<DomainEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.date),
);
