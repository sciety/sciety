import { templateDate } from '../../../shared-components/date.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { ArticleVersionFeedItem } from '../view-model.js';
import { articleServers } from '../../../types/article-server.js';

type RenderArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => HtmlFragment;

export const renderArticleVersionFeedItem: RenderArticleVersionFeedItem = (feedItem) => toHtmlFragment(`
  <div class="activity-feed__item__contents">
    <header class="activity-feed__item__header">
      <img class="activity-feed__item__avatar" src="${articleServers[feedItem.server].avatarUrl}" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version ${feedItem.version} published on ${articleServers[feedItem.server].name}
          </a>
        </div>
        ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
      </div>
    </header>
  </div>
`);
