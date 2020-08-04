import templateDate from '../templates/date';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';

export type RenderFeedItem = (event: Event) => Promise<string>;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: string;
};

export type ArticleEndorsedEvent = {
  type: 'ArticleEndorsed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
};

const isArticleEndorsedEvent = (event: Event): event is ArticleEndorsedEvent => (
  'type' in event && event.type === 'ArticleEndorsed'
);

export type ArticleReviewedEvent = {
  type: 'ArticleReviewed';
  date: Date;
  actorId: EditorialCommunityId;
  articleId: Doi;
};

const isArticleReviewedEvent = (event: Event): event is ArticleReviewedEvent => (
  'type' in event && event.type === 'ArticleReviewed'
);

export type EditorialCommunityJoinedEvent = {
  type: 'EditorialCommunityJoined';
  date: Date;
  actorId: EditorialCommunityId;
};

export type Event = ArticleEndorsedEvent | ArticleReviewedEvent | EditorialCommunityJoinedEvent;

type TemplateFeedItem = (getArticle: GetArticle, event: Event, actor: Actor) => Promise<string>;

const templateFeedItem: TemplateFeedItem = async (getArticle, event, actor) => {
  if (isArticleEndorsedEvent(event)) {
    const article = await getArticle(event.articleId);

    return `
      <a href="${actor.url}">${actor.name}</a>
      endorsed
      <a href="/articles/${event.articleId.value}">${article.title}</a>
    `;
  }
  if (isArticleReviewedEvent(event)) {
    const article = await getArticle(event.articleId);

    return `
      <a href="${actor.url}">${actor.name}</a>
      reviewed
      <a href="/articles/${event.articleId.value}">${article.title}</a>
    `;
  }
  return `
    <a href="${actor.url}">${actor.name}</a>
    joined The Hive
  `;
};

export type GetActor = (id: EditorialCommunityId) => Promise<Actor>;

export type GetArticle = (id: Doi) => Promise<Article>;

export default (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderFeedItem => (
  async (event) => {
    const actor = await getActor(event.actorId);
    return `
      <div class="label">
        <img src="${actor.imageUrl}" alt="">
      </div>
      <div class="content">
        <div class="date">
          ${templateDate(event.date)}
        </div>
        <div class="summary">
          ${await templateFeedItem(getArticle, event, actor)}
        </div>
      </div>
    `;
  }
);
