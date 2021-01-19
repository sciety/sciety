import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { EventId, generate } from './event-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type EditorialCommunityEndorsedArticleEvent = Readonly<{
  type: 'EditorialCommunityEndorsedArticle';
  date: Date;
  editorialCommunityId: EditorialCommunityId;
  articleId: Doi;
}>;

export const isEditorialCommunityEndorsedArticleEvent = (event: DomainEvent):
event is EditorialCommunityEndorsedArticleEvent => (
  event.type === 'EditorialCommunityEndorsedArticle'
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type EditorialCommunityReviewedArticleEvent = Readonly<{
  type: 'EditorialCommunityReviewedArticle';
  date: Date;
  editorialCommunityId: EditorialCommunityId;
  articleId: Doi;
  reviewId: ReviewId;
}>;

export const isEditorialCommunityReviewedArticleEvent = (event: DomainEvent):
event is EditorialCommunityReviewedArticleEvent => (
  event.type === 'EditorialCommunityReviewedArticle'
);

export const editorialCommunityReviewedArticle = (
  editorialCommunityId: EditorialCommunityId,
  doi: Doi,
  reviewId: ReviewId,
): EditorialCommunityReviewedArticleEvent => ({
  type: 'EditorialCommunityReviewedArticle',
  date: new Date(),
  editorialCommunityId,
  articleId: doi,
  reviewId,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type EditorialCommunityJoinedEvent = Readonly<{
  type: 'EditorialCommunityJoined';
  date: Date;
  editorialCommunityId: EditorialCommunityId;
}>;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type UserFollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserFollowedEditorialCommunity';
  date: Date;
  userId: UserId;
  editorialCommunityId: EditorialCommunityId;
}>;

export const userFollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId,
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
  type: 'UserUnfollowedEditorialCommunity';
  date: Date;
  userId: UserId;
  editorialCommunityId: EditorialCommunityId;
}>;

export const userUnfollowedEditorialCommunity = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId,
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
  type: 'UserFoundReviewHelpful';
  date: Date;
  userId: UserId;
  reviewId: ReviewId;
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
  type: 'UserRevokedFindingReviewHelpful';
  date: Date;
  userId: UserId;
  reviewId: ReviewId;
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
  type: 'UserFoundReviewNotHelpful';
  date: Date;
  userId: UserId;
  reviewId: ReviewId;
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
  type: 'UserRevokedFindingReviewNotHelpful';
  date: Date;
  userId: UserId;
  reviewId: ReviewId;
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

type UserSavedArticleEvent = Readonly<{
  type: 'UserSavedArticle';
  date: Date;
  userId: UserId;
  articleId: Doi;
}>;

export const userSavedArticle = (userId: UserId, doi: Doi): UserSavedArticleEvent => ({
  type: 'UserSavedArticle',
  date: new Date(),
  userId,
  articleId: doi,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type DomainEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent |
  EditorialCommunityJoinedEvent |
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
  UserRevokedFindingReviewNotHelpfulEvent;
