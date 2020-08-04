import Doi from './doi';
import EditorialCommunityId from './editorial-community-id';

export type ArticleEndorsedEvent = {
  type: 'ArticleEndorsed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
};

export const isArticleEndorsedEvent = (event: Event): event is ArticleEndorsedEvent => (
  event.type === 'ArticleEndorsed'
);

export type ArticleReviewedEvent = {
  type: 'ArticleReviewed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
};

export const isArticleReviewedEvent = (event: Event): event is ArticleReviewedEvent => (
  event.type === 'ArticleReviewed'
);

export type EditorialCommunityJoinedEvent = {
  type: 'EditorialCommunityJoined';
  date: Date;
  actorId: EditorialCommunityId;
};

export const isEditorialCommunityJoinedEvent = (event: Event): event is EditorialCommunityJoinedEvent => (
  event.type === 'EditorialCommunityJoined'
);

export type Event = ArticleEndorsedEvent | ArticleReviewedEvent | EditorialCommunityJoinedEvent;
