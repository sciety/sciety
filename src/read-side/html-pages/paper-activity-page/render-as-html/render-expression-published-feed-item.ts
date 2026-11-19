import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { articleServers } from '../../../../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
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
    (serverKey) => `<img class="activity-feed-item__avatar" src="${articleServers[serverKey].avatarUrl}" alt="">`,
  ),
);

type RenderExpressionPublishedFeedItem = (feedItem: ExpressionPublishedFeedItem) => HtmlFragment;

export const renderExpressionPublishedFeedItem: RenderExpressionPublishedFeedItem = (feedItem) => toHtmlFragment(`
  <div class="activity-feed-item-contents">
    <header class="activity-feed-item__header">
      ${renderServerAvatar(feedItem.server)}
      <div class="activity-feed-item__meta">
        <div class="activity-feed-item__title">
          <a href="${feedItem.source.toString()}">
            Version published to ${`${feedItem.publishedTo}${onServer(feedItem.server)}`}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed-item__date')}
      </div>
    </header>
  </div>
`);
