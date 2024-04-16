import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../../shared-components/date';
import { articleServers } from '../../../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ExpressionPublishedFeedItem } from '../view-model';

const onServer = (server: ExpressionPublishedFeedItem['server']) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => ` on ${articleServers[serverKey].name}`,
  ),
);

const renderServerAvatar = (server: ExpressionPublishedFeedItem['server']) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => `<img class="activity-feed__item__avatar" src="${articleServers[serverKey].avatarUrl}" alt="">`,
  ),
);

type RenderExpressionPublishedFeedItem = (feedItem: ExpressionPublishedFeedItem) => HtmlFragment;

export const renderExpressionPublishedFeedItem: RenderExpressionPublishedFeedItem = (feedItem) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      ${renderServerAvatar(feedItem.server)}
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version published to ${`${feedItem.publishedTo}${onServer(feedItem.server)}`}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
  </div>
`);
