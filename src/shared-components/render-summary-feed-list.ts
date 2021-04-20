import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/function';
import { templateDate } from './date';
import { templateListItems } from './list-items';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FeedItem = {
  avatar: string,
  date: Date,
  actorName: string,
  actorUrl: string,
  doi: Doi,
  title: SanitisedHtmlFragment,
  verb: string,
};

const renderItem = (viewModel: FeedItem) => `
  <div class="summary-feed-item">
    <img src="${viewModel.avatar}" alt="" class="summary-feed-item__avatar">
    <div>
      ${templateDate(viewModel.date, 'summary-feed-item__date')}
      <div class="summary-feed-item__title">
        <a href="${viewModel.actorUrl}" class="summary-feed-item__link">${viewModel.actorName}</a>
        ${viewModel.verb}
        <a href="/articles/activity/${viewModel.doi.value}" class="summary-feed-item__link">${viewModel.title}</a>
      </div>
    </div>
  </div>
`;

const renderSummaryFeedItem = flow(
  renderItem,
  toHtmlFragment,
);

const renderAsList = (items: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => `
  <ol class="summary-feed-list" role="list">
    ${templateListItems(items, 'summary-feed-list__list_item')}
  </ol>
`;

export const renderSummaryFeedList = flow(
  RNEA.map(renderSummaryFeedItem),
  renderAsList,
  toHtmlFragment,
);
