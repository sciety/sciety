import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-article-version-feed-item';
import { MetaDescription } from './render-description-meta-tag-content';
import { FeedItem } from './render-feed';
import { ReviewFeedItem } from './render-review-feed-item';

export const articleMetaTagContent = (feedItems: ReadonlyArray<FeedItem>): MetaDescription => ({
  evaluationCount: feedItems.filter((item) => item.type === 'review').length,
  latestVersion: pipe(
    feedItems,
    RA.filter((item): item is ArticleVersionFeedItem => item.type === 'article-version'),
    RA.lookup(0),
    O.map((articleVersionFeedItem) => articleVersionFeedItem.publishedAt),
  ),
  latestActivity: pipe(
    feedItems,
    RA.filter((item): item is ReviewFeedItem => item.type === 'review'),
    RA.lookup(0),
    O.map((reviewFeedItem) => reviewFeedItem.publishedAt),
  ),
});
