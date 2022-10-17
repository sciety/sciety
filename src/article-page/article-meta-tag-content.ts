import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-as-html/render-article-version-feed-item';
import { ReviewFeedItem } from './render-as-html/render-review-feed-item';
import { FeedItem } from './view-model';

type FeedSummary = {
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};

export const articleMetaTagContent = (feedItems: ReadonlyArray<FeedItem>): FeedSummary => ({
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
