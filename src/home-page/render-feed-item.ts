import templateDate from '../templates/date';
import Doi from '../types/doi';
import {
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

export type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

export type RenderFeedItem = (event: FeedEvent) => Promise<string>;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: string;
};

type RenderFeedItemSummary = (event: FeedEvent, actor: Actor) => Promise<string>;

const createRenderFeedItemSummary = (getArticle: GetArticle): RenderFeedItemSummary => {
  type RenderEvent<E extends FeedEvent> = (event: E, actor: Actor) => Promise<string>;

  const renderEditorialCommunityEndorsedArticle: RenderEvent<EditorialCommunityEndorsedArticleEvent> = async (
    event,
    actor,
  ) => {
    const endorsedArticle = await getArticle(event.articleId);

    return `
      <a href="${actor.url}">${actor.name}</a>
      endorsed
      <a href="/articles/${event.articleId.value}">${endorsedArticle.title}</a>
    `;
  };

  const renderEditorialCommunityReviewedArticle: RenderEvent<EditorialCommunityReviewedArticleEvent> = async (
    event,
    actor,
  ) => {
    const article = await getArticle(event.articleId);

    return `
      <a href="${actor.url}">${actor.name}</a>
      reviewed
      <a href="/articles/${event.articleId.value}">${article.title}</a>
    `;
  };

  return async (event, actor) => {
    switch (event.type) {
      case 'EditorialCommunityEndorsedArticle': return renderEditorialCommunityEndorsedArticle(event, actor);
      case 'EditorialCommunityReviewedArticle': return renderEditorialCommunityReviewedArticle(event, actor);
    }
  };
};

export type GetActor = (id: EditorialCommunityId) => Promise<Actor>;

export type GetArticle = (id: Doi) => Promise<Article>;

export default (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderFeedItem => {
  const renderFeedItemSummary = createRenderFeedItemSummary(getArticle);

  return async (event) => {
    const actor: Actor = await getActor(event.editorialCommunityId);
    return `
      <div class="label">
        <img src="${actor.imageUrl}" alt="">
      </div>
      <div class="content">
        <div class="date">
          ${templateDate(event.date)}
        </div>
        <div class="summary">
          ${await renderFeedItemSummary(event, actor)}
        </div>
      </div>
    `;
  };
};
