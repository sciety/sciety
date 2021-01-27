import * as O from 'fp-ts/lib/Option';
import { Result } from 'true-myth';
import { createRenderArticleVersionErrorFeedItem } from './render-article-version-error-feed-item';
import { ArticleVersionFeedItem, RenderArticleVersionFeedItem } from './render-article-version-feed-item';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import renderDate from '../shared-components/date';
import renderListItems from '../shared-components/list-items';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (doi: Doi, server: ArticleServer, userId: O.Option<UserId>) => Promise<Result<HtmlFragment, 'no-content'>>;

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

export type GetFeedItems = (doi: Doi, server: ArticleServer) => Promise<ReadonlyArray<FeedItem>>;

export const createRenderFeed = (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderArticleVersionFeedItem: RenderArticleVersionFeedItem,
): RenderFeed => {
  const renderArticleVersionErrorFeedItem = createRenderArticleVersionErrorFeedItem();

  const renderFeedItem = async (feedItem: FeedItem, userId: O.Option<UserId>): Promise<HtmlFragment> => {
    switch (feedItem.type) {
      case 'article-version':
        if (feedItem.server === 'medrxiv') {
          return toHtmlFragment(`
            <div class="article-feed__item_contents">
              <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956565401588002816/0rESoCS0_200x200.jpg" alt="">
              <div>
                ${renderDate(feedItem.occurredAt, 'article-feed__item__date')}
                <p class="article-feed__item__title">
                  <a href="${feedItem.source.toString()}">
                    Version ${feedItem.version} published on medRxiv
                  </a>
                </p>
              </div>
            </div>
          `);
        }
        return renderArticleVersionFeedItem(feedItem);
      case 'article-version-error':
        if (feedItem.server === 'medrxiv') {
          return toHtmlFragment(`
            <div class="article-feed__item_contents">
              <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956565401588002816/0rESoCS0_200x200.jpg" alt="">
              <div>
                <p class="article-feed__item__title">
                  Published on medRxiv
                </p>
                <p>
                  We couldn't get version information from medRxiv. Please try refreshing this page.
                </p>
              </div>
            </div>
          `);
        }
        return renderArticleVersionErrorFeedItem();
      case 'review':
        return renderReviewFeedItem(feedItem, userId)();
    }
  };

  return async (doi, server, userId) => {
    const feedItems = await getFeedItems(doi, server);

    if (feedItems.length === 0) {
      return Result.err('no-content');
    }

    const items = await Promise.all(feedItems.map(
      async (feedItem) => renderFeedItem(feedItem, userId),
    ));

    return Result.ok(toHtmlFragment(`
      <section class="article-feed">
        <h2>Feed</h2>

        <ol role="list" class="article-feed__list">
          ${renderListItems(items, 'article-feed__item')}
        </ol>
      </section>
    `));
  };
};
