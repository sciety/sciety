import * as E from 'fp-ts/Either';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-article-version-feed-item';
import { ReviewFeedItem } from './render-review-feed-item';
import { templateListItems } from '../shared-components';
import { ArticleServer } from '../types/article-server';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFeed = (feedItems: ReadonlyArray<FeedItem>) => E.Either<'no-content', HtmlFragment>;

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

type RenderFeedItem = (feedItem: FeedItem) => HtmlFragment;

export const renderFeed = (
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  flow(
    RNEA.fromReadonlyArray,
    E.fromOption(constant('no-content' as const)),
    E.map(flow(
      RNEA.map(renderFeedItem),
      (items) => `
        <section class="activity-feed">
          <ol role="list" class="activity-feed__list">
            ${templateListItems(items, 'activity-feed__item')}
          </ol>
        </section>
      `,
      toHtmlFragment,
    )),
  )
);
