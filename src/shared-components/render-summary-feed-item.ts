import { sequenceS } from 'fp-ts/lib/Apply';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import templateDate from './date';
import { Doi } from '../types/doi';
import {
  EditorialCommunityEndorsedArticleEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityEndorsedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

type RenderSummaryFeedItem = (event: FeedEvent) => T.Task<HtmlFragment>;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type Article = {
  title: SanitisedHtmlFragment;
};

const reviewedBy = (actor: Actor): string => (
  (actor.name === 'preLights') ? 'highlighted' : 'reviewed'
);

const verb = (event: FeedEvent, actor: Actor): string => (
  isEditorialCommunityEndorsedArticleEvent(event) ? 'endorsed' : reviewedBy(actor)
);

const renderItem = (getArticle: GetArticle, event: FeedEvent, actor: Actor): T.Task<HtmlFragment> => pipe(
  event.articleId,
  getArticle,
  T.map(flow(
    (result) => result.mapOr(toHtmlFragment('an article'), (article) => article.title),
    (title) => `
      <a href="${actor.url}" class="summary-feed-item__link">${actor.name}</a>
      ${verb(event, actor)}
      <a href="/articles/${event.articleId.value}" class="summary-feed-item__link">${title}</a>
    `,
    toHtmlFragment,
  )),
);

type ViewModel = {
  avatar: string,
  date: Date,
  item: HtmlFragment;
};

const render = (viewModel: ViewModel): string => `
  <div class="summary-feed-item">
    <img src="${viewModel.avatar}" alt="" class="summary-feed-item__avatar">
    <div>
      ${templateDate(viewModel.date, 'summary-feed-item__date')}
      <div class="summary-feed-item__title">
        ${viewModel.item}
      </div>
    </div>
  </div>
`;

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export const renderSummaryFeedItem = (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedItem => (event) => pipe(
  event.editorialCommunityId,
  getActor,
  T.chain(flow(
    (actor) => ({
      avatar: T.of(actor.imageUrl),
      date: T.of(event.date),
      item: renderItem(getArticle, event, actor),
    }),
    sequenceS(T.task),
  )),
  T.map(render),
  T.map(toHtmlFragment),
);
