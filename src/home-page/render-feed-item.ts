import templateDate from '../templates/date';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderFeedItem = (event: Event) => Promise<string>;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type ArticleEndorsedEvent = {
  type: 'ArticleEndorsed';
  date: Date;
  actor: Actor;
  actorId: EditorialCommunityId;
  articleId: string;
  articleTitle: string;
};

const isArticleEndorsedEvent = (event: Event): event is ArticleEndorsedEvent => (
  'type' in event && event.type === 'ArticleEndorsed'
);

type ArticleReviewedEvent = {
  type: 'ArticleReviewed';
  date: Date;
  actor: Actor;
  actorId: EditorialCommunityId;
  articleId: string;
  articleTitle: string;
};

const isArticleReviewedEvent = (event: Event): event is ArticleReviewedEvent => (
  'type' in event && event.type === 'ArticleReviewed'
);

type EditorialCommunityJoinedEvent = {
  type: 'EditorialCommunityJoined';
  date: Date;
  actor: Actor;
  actorId: EditorialCommunityId;
};

export type Event = ArticleEndorsedEvent | ArticleReviewedEvent | EditorialCommunityJoinedEvent;

type TemplateFeedItem = (event: Event) => string;

const templateFeedItem: TemplateFeedItem = (event) => {
  if (isArticleEndorsedEvent(event)) {
    return `
      <a href="${event.actor.url}">${event.actor.name}</a>
      endorsed
      <a href="/articles/${event.articleId}">${event.articleTitle}</a>
    `;
  }
  if (isArticleReviewedEvent(event)) {
    return `
      <a href="${event.actor.url}">${event.actor.name}</a>
      reviewed
      <a href="/articles/${event.articleId}">${event.articleTitle}</a>
    `;
  }
  return `
    <a href="${event.actor.url}">${event.actor.name}</a>
    joined The Hive
  `;
};

const renderFeedItem: RenderFeedItem = async (event) => (
  `
    <div class="label">
      <img src="${event.actor.imageUrl}">
    </div>
    <div class="content">
      <div class="date">
        ${templateDate(event.date)}
      </div>
      <div class="summary">
        ${templateFeedItem(event)}
      </div>
    </div>
  `
);

export default renderFeedItem;
