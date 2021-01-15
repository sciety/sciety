import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
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

type RenderSummaryFeedItemSummary = (event: FeedEvent, actor: Actor) => T.Task<string>;

const renderSummaryFeedItemSummary = (getArticle: GetArticle): RenderSummaryFeedItemSummary => {
  type RenderEvent = (doi: Doi, actor: Actor, action: string) => T.Task<string>;

  const renderEvent: RenderEvent = (doi, actor, action) => pipe(
    doi,
    getArticle,
    T.map(flow(
      (result) => result.mapOr(toHtmlFragment('an article'), (article) => article.title),
      (title) => `
        <a href="${actor.url}" class="summary-feed-item__link">${actor.name}</a>
        ${action}
        <a href="/articles/${doi.value}" class="summary-feed-item__link">${title}</a>
      `,
      toHtmlFragment,
    )),
  );

  return (event, actor) => {
    switch (event.type) {
      case 'EditorialCommunityEndorsedArticle':
        return renderEvent(event.articleId, actor, 'endorsed');
      case 'EditorialCommunityReviewedArticle':
        return renderEvent(event.articleId, actor, actor.name === 'preLights' ? 'highlighted' : 'reviewed');
    }
  };
};

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export default (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedItem => async (event) => {
  const actor: Actor = await getActor(event.editorialCommunityId)();
  return toHtmlFragment(`
    <div class="summary-feed-item">
      <img src="${actor.imageUrl}" alt="" class="summary-feed-item__avatar">
      <div>
        ${templateDate(event.date, 'summary-feed-item__date')}
        <div class="summary-feed-item__title">
          ${await renderSummaryFeedItemSummary(getArticle)(event, actor)()}
        </div>
      </div>
    </div>
  `);
};
