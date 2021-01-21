import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { constructFeedItem } from './construct-feed-item';
import templateDate from './date';
import { Doi } from '../types/doi';
import { EditorialCommunityEndorsedArticleEvent, EditorialCommunityReviewedArticleEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FeedEvent =
  EditorialCommunityEndorsedArticleEvent |
  EditorialCommunityReviewedArticleEvent;

type RenderSummaryFeedItem = (event: FeedEvent) => T.Task<HtmlFragment>;

type FeedItem = {
  avatar: string,
  date: Date,
  actorName: string,
  actorUrl: string,
  doi: Doi,
  title: SanitisedHtmlFragment,
  verb: string,
};

const render = (viewModel: FeedItem): string => `
  <div class="summary-feed-item">
    <img src="${viewModel.avatar}" alt="" class="summary-feed-item__avatar">
    <div>
      ${templateDate(viewModel.date, 'summary-feed-item__date')}
      <div class="summary-feed-item__title">
        <a href="${viewModel.actorUrl}" class="summary-feed-item__link">${viewModel.actorName}</a>
        ${viewModel.verb}
        <a href="/articles/${viewModel.doi.value}" class="summary-feed-item__link">${viewModel.title}</a>
      </div>
    </div>
  </div>
`;

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

export type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

type Article = {
  title: SanitisedHtmlFragment;
};

export type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

export const renderSummaryFeedItem = (getActor: GetActor, getArticle: GetArticle): RenderSummaryFeedItem => flow(
  constructFeedItem(getActor, getArticle),
  T.map(flow(
    render,
    toHtmlFragment,
  )),
);
