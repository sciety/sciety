import { URL } from 'url';
import renderDate from '../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ArticleVersionFeedItem = {
  type: 'article-version';
  source: URL;
  occurredAt: Date;
  version: number;
};

export type RenderArticleVersionFeedItem = (feedItem: ArticleVersionFeedItem) => HtmlFragment;

export const createRenderArticleVersionFeedItem = (
): RenderArticleVersionFeedItem => (
  (feedItem: ArticleVersionFeedItem) => toHtmlFragment(`
    <div class="article-feed__item_contents">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
      <div>
        ${renderDate(feedItem.occurredAt, 'article-feed__item__date')}
        <p class="article-feed__item__title">
          <a href="${feedItem.source.toString()}">
            Version ${feedItem.version} published on bioRxiv
          </a>
        </p>
      </div>
    </div>
  `)
);
