import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { constructFeedItem, FeedEvent } from './construct-feed-item';
import templateDate from './date';
import templateListItems from './list-items';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FeedItem = {
  avatar: string,
  date: Date,
  actorName: string,
  actorUrl: string,
  doi: Doi,
  title: SanitisedHtmlFragment,
  verb: string,
};

const renderItem = (viewModel: FeedItem): string => `
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

type RenderSummaryFeedItem = (event: FeedEvent) => T.Task<HtmlFragment>;

const renderSummaryFeedItem = (getActor: GetActor, getArticle: GetArticle): RenderSummaryFeedItem => flow(
  constructFeedItem(getActor, getArticle),
  T.map(flow(
    renderItem,
    toHtmlFragment,
  )),
);

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

type Article = {
  title: SanitisedHtmlFragment;
};

type GetArticle = (id: Doi) => T.Task<Result<Article, unknown>>;

const renderAsList = (items: ReadonlyArray<HtmlFragment>): string => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

export type RenderSummaryFeedList = (events: ReadonlyArray<FeedEvent>) => T.Task<O.Option<HtmlFragment>>;

export const renderSummaryFeedList = (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderSummaryFeedList => flow(
  T.traverseArray(renderSummaryFeedItem(getActor, getArticle)),
  T.map(O.fromPredicate((es) => es.length > 0)),
  T.map(O.map(flow(
    renderAsList,
    toHtmlFragment,
  ))),
);
