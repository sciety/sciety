import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';
import { ReviewId } from './review-id';
import { UserId } from './user-id';

export type ArticleEndorsedEvent = {
  type: 'ArticleEndorsed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
};

export const isArticleEndorsedEvent = (event: DomainEvent): event is ArticleEndorsedEvent => (
  event.type === 'ArticleEndorsed'
);

export type ArticleReviewedEvent = {
  type: 'ArticleReviewed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
  reviewId: ReviewId;
};

export const isArticleReviewedEvent = (event: DomainEvent): event is ArticleReviewedEvent => (
  event.type === 'ArticleReviewed'
);

export type EditorialCommunityJoinedEvent = {
  type: 'EditorialCommunityJoined';
  date: Date;
  actorId: EditorialCommunityId;
};

export const isEditorialCommunityJoinedEvent = (event: DomainEvent): event is EditorialCommunityJoinedEvent => (
  event.type === 'EditorialCommunityJoined'
);

export type UserFollowedEditorialCommunityEvent = {
  type: 'UserFollowedEditorialCommunity';
  date: Date;
  userId: UserId;
  editorialCommunityId: EditorialCommunityId;
};

export type DomainEvent =
  ArticleEndorsedEvent |
  ArticleReviewedEvent |
  EditorialCommunityJoinedEvent;
