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

export type RenderArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => HtmlFragment;

const renderBiorxivArticleVersionFeedItem: RenderArticleVersionFeedItem = (feedItem) => toHtmlFragment(`
  <div class="article-feed__item_contents">
    <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
    <div>
      ${templateDate(feedItem.occurredAt, 'article-feed__item__date')}
      <p class="article-feed__item__title">
        <a href="${feedItem.source.toString()}">
          Version ${feedItem.version} published on bioRxiv
        </a>
      </p>
    </div>
  </div>
`);

const renderMedrxivArticleVersionFeedItem: RenderArticleVersionFeedItem = (feedItem) => toHtmlFragment(`
  <div class="article-feed__item_contents">
    <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956565401588002816/0rESoCS0_200x200.jpg" alt="">
    <div>
      ${templateDate(feedItem.occurredAt, 'article-feed__item__date')}
      <p class="article-feed__item__title">
        <a href="${feedItem.source.toString()}">
          Version ${feedItem.version} published on medRxiv
        </a>
      </p>
    </div>
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
