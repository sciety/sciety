import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ScietyFeedCardDetails = {
  title: HtmlFragment,
  content: HtmlFragment,
};

type ScietyFeedCard = (viewModel: {
  titleText: string,
  linkUrl: string,
  avatarUrl: string,
  date: Date,
  details?: ScietyFeedCardDetails,
}) => HtmlFragment;

export const scietyFeedCard: ScietyFeedCard = (viewModel) => pipe(
  viewModel.details,
  (details) => (details
    ? `
        <div class="sciety-feed-card__details">
          <h3 class="sciety-feed-card__details_title">${details.title}</h3>
          ${details.content}
        </div>
      `
    : ''),
  toHtmlFragment,
  (details) => `
    <article class="sciety-feed-card">
      <a href="${viewModel.linkUrl}" class="sciety-feed-card__link">
        <div class="sciety-feed-card__event_title">
          <img class="sciety-feed-card__avatar" src="${viewModel.avatarUrl}" alt="">
          <h2 class="sciety-feed-card__event_title_text">${viewModel.titleText}</h2>
          ${templateDate(viewModel.date, 'sciety-feed-card__event_date')}
        </div>
        ${details}
      </a>
    </article>
  `,
  toHtmlFragment,
);
