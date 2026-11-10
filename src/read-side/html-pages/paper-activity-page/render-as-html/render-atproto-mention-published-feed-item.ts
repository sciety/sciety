import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { AtprotoMentionPublishedFeedItem } from '../view-model';

type RenderAtprotoMentionPublishedFeedItem = (feedItem: AtprotoMentionPublishedFeedItem) => HtmlFragment;

export const renderAtprotoMentionPublishedFeedItem: RenderAtprotoMentionPublishedFeedItem = (
  feedItem,
) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${htmlEscape(feedItem.href)}">
            Mentioned by @${htmlEscape(feedItem.authorHandle)} on ${htmlEscape(feedItem.source)}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
    <div class="activity-feed__item__body">
      <p>${htmlEscape(feedItem.text)}</p>
    </div>
  </div>
`);
