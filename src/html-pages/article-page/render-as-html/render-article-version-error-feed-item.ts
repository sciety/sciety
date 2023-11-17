import { pipe } from 'fp-ts/function';
import { retryLater } from './static-messages.js';
import { ArticleServer, articleServers } from '../../../types/article-server.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';

export const renderVersionErrorFeedItem = (server: ArticleServer): HtmlFragment => pipe(
  articleServers[server],
  (viewModel) => `
    <div class="activity-feed__item__contents">
      <header class="activity-feed__item__header">
        <img class="activity-feed__item__avatar" src="${viewModel.avatarUrl}" alt="">
        <div class="activity-feed__item__meta">
          <div class="activity-feed__item__title">
            Published on ${viewModel.name}
          </div>
        </div>
      </header>
      <p>
        We couldn't get version information from ${viewModel.name}.
        ${viewModel.versionsSupported ? retryLater : ''}
      </p>
    </div>
  `,
  toHtmlFragment,
);
