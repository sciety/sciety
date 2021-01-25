import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/ReadonlyArray';
import { flow } from 'fp-ts/lib/function';
import templateDate from './date';
import templateListItems from './list-items';
import { Doi } from '../types/doi';
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

type RenderSummaryFeedItem = (item: FeedItem) => HtmlFragment;

const renderSummaryFeedItem: RenderSummaryFeedItem = flow(
  renderItem,
  toHtmlFragment,
);

const renderAsList = (items: ReadonlyArray<HtmlFragment>): string => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

type RenderSummaryFeedList = (events: ReadonlyArray<FeedItem>) => O.Option<HtmlFragment>;

export const renderSummaryFeedList: RenderSummaryFeedList = flow(
  A.map(renderSummaryFeedItem),
  O.fromPredicate((es) => es.length > 0),
  O.map(flow(
    renderAsList,
    toHtmlFragment,
  )),
);
