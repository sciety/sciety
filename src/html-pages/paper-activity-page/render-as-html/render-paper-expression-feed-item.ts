import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { PaperExpressionFeedItem } from '../view-model';
import { articleServers } from '../../../types/article-server';

const renderServerAvatar = (server: O.Option<PaperExpressionFeedItem['server']>) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => `<img class="activity-feed__item__avatar" src="${articleServers[serverKey].avatarUrl}" alt="">`,
  ),
);

const onServer = (server: O.Option<PaperExpressionFeedItem['server']>) => pipe(
  server,
  O.match(
    () => '',
    (serverKey) => ` on ${articleServers[serverKey].name}`,
  ),
);

type RenderPaperExpressionFeedItem = (feedItem: PaperExpressionFeedItem) => HtmlFragment;

export const renderPaperExpressionFeedItem: RenderPaperExpressionFeedItem = (feedItem) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      ${renderServerAvatar(O.some(feedItem.server))}
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version published to ${feedItem.doi}${onServer(O.some(feedItem.server))}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
  </div>
`);
