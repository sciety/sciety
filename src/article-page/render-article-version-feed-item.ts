import { URL } from 'url';
import { templateDate } from '../shared-components/date';
import { ArticleServer } from '../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ArticleVersionFeedItem = {
  type: 'article-version',
  source: URL,
  occurredAt: Date,
  version: number,
  server: ArticleServer,
};

type RenderArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => HtmlFragment;

const renderBiorxivArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <header class="activity-feed__item_header">
      <img class="activity-feed__item__avatar" src="/static/images/biorxiv.jpg" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version ${feedItem.version} published on bioRxiv
          </a>
        </div>
        ${templateDate(feedItem.occurredAt, 'activity-feed__item__date')}
      </div>
    </header>
  </div>
`);

const renderMedrxivArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item_contents">
    <header class="activity-feed__item_header">
      <img class="activity-feed__item__avatar" src="/static/images/medrxiv.jpg" alt="">
      <div class="activity-feed__item__meta">
        <div class="activity-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version ${feedItem.version} published on medRxiv
          </a>
        </div>
        ${templateDate(feedItem.occurredAt, 'activity-feed__item__date')}
      </div>
    </header>
  </div>
`);

export const renderArticleVersionFeedItem: RenderArticleVersionFeedItem = (feedItem) => {
  switch (feedItem.server) {
    case 'medrxiv':
      return renderMedrxivArticleVersionFeedItem(feedItem);
    case 'biorxiv':
      return renderBiorxivArticleVersionFeedItem(feedItem);
  }
};
