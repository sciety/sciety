import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';

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

export type DomainEvent = ArticleEndorsedEvent | ArticleReviewedEvent | EditorialCommunityJoinedEvent;
