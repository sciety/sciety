import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { safelyRenderRawUserInput } from '../../../shared-components/raw-user-input-renderers';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ScietyFeedCard } from '../view-model';

export const renderScietyFeedCard = (viewModel: ScietyFeedCard): HtmlFragment => pipe(
  viewModel.details,
  (details) => (details
    ? `
        <div class="sciety-feed-card__details">
          <h3 class="sciety-feed-card__details_title">${details.title}</h3>
          <p>${safelyRenderRawUserInput(details.content)}</p>
        </div>
      `
    : ''),
  toHtmlFragment,
  (details) => `
    <article class="sciety-feed-card">
        <div class="sciety-feed-card__event_title">
          <img class="sciety-feed-card__avatar" src="${viewModel.avatarUrl}" alt="">
          <h2 class="sciety-feed-card__event_title_text"><a href="${viewModel.feedItemHref}" class="sciety-feed-card__link">${htmlEscape(viewModel.titleText)}</a></h2>
          ${templateDate(viewModel.date, 'sciety-feed-card__event_date')}
        </div>
        ${details}
    </article>
  `,
  toHtmlFragment,
);
