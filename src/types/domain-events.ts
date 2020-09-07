import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { EventId } from './event-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

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

export type EditorialCommunityJoinedEvent = Readonly<{
  type: 'EditorialCommunityJoined';
  date: Date;
  editorialCommunityId: EditorialCommunityId;
}>;

export const isEditorialCommunityJoinedEvent = (event: DomainEvent): event is EditorialCommunityJoinedEvent => (
  event.type === 'EditorialCommunityJoined'
);

export type UserFollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserFollowedEditorialCommunity';
  date: Date;
  userId: UserId;
  editorialCommunityId: EditorialCommunityId;
}>;

export const isUserFollowedEditorialCommunityEvent = (event: DomainEvent):
  event is UserFollowedEditorialCommunityEvent => (
  event.type === 'UserFollowedEditorialCommunity'
);

export type UserUnfollowedEditorialCommunityEvent = Readonly<{
  id: EventId,
  type: 'UserUnfollowedEditorialCommunity';
  date: Date;
  userId: UserId;
  editorialCommunityId: EditorialCommunityId;
}>;

export type DomainEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent |
  EditorialCommunityJoinedEvent |
  UserFollowedEditorialCommunityEvent |
  UserUnfollowedEditorialCommunityEvent;
