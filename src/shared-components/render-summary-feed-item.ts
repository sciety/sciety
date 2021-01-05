import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import templateDate from './date';
import Doi from '../types/doi';
import {
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

type RenderSummaryFeedItem = (event: FeedEvent) => Promise<HtmlFragment>;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: SanitisedHtmlFragment;
};

type RenderSummaryFeedItemSummary = (event: FeedEvent, actor: Actor) => Promise<string>;

const createRenderSummaryFeedItemSummary = (getArticle: GetArticle): RenderSummaryFeedItemSummary => {
  type RenderEvent<E extends FeedEvent> = (event: E, actor: Actor) => Promise<string>;

  const title = async (articleId: Doi): Promise<HtmlFragment> => (
    (await getArticle(articleId)()).mapOr(toHtmlFragment('an article'), (article) => article.title)
  );

  const renderEditorialCommunityEndorsedArticle: RenderEvent<EditorialCommunityEndorsedArticleEvent> = async (
    event,
    actor,
  ) => toHtmlFragment(`
      <a href="${actor.url}" class="summary-feed-item__link">${actor.name}</a>
      endorsed
      <a href="/articles/${event.articleId.value}" class="summary-feed-item__link">${await title(event.articleId)}</a>
    `);

  const renderEditorialCommunityReviewedArticle: RenderEvent<EditorialCommunityReviewedArticleEvent> = async (
    event,
    actor,
  ) => toHtmlFragment(`
      <a href="${actor.url}" class="summary-feed-item__link">${actor.name}</a>
      ${actor.name === 'preLights' ? 'highlighted' : 'reviewed'}
      <a href="/articles/${event.articleId.value}" class="summary-feed-item__link">${await title(event.articleId)}</a>
    `);

  return async (event, actor) => {
    switch (event.type) {
      case 'EditorialCommunityEndorsedArticle': return renderEditorialCommunityEndorsedArticle(event, actor);
      case 'EditorialCommunityReviewedArticle': return renderEditorialCommunityReviewedArticle(event, actor);
    }
  };
};

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export default (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedItem => {
  const renderSummaryFeedItemSummary = createRenderSummaryFeedItemSummary(getArticle);

  return async (event) => {
    const actor: Actor = await getActor(event.editorialCommunityId)();
    return toHtmlFragment(`
      <div class="summary-feed-item">
        <img src="${actor.imageUrl}" alt="" class="summary-feed-item__avatar">
        <div>
          ${templateDate(event.date, 'summary-feed-item__date')}
          <div class="summary-feed-item__title">
            ${await renderSummaryFeedItemSummary(event, actor)}
          </div>
        </div>
      </div>
    `);
  };
};
