import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleVersionFeedItem } from './render-article-version-feed-item';
import { FeedItem } from './render-feed';

export type MetaDescription = {
  evaluationCount: number,
  latestVersion: O.Option<Date>,
};

export const articleMetaTagContent = (feedItems: ReadonlyArray<FeedItem>): MetaDescription => ({
  evaluationCount: feedItems.filter((item) => item.type === 'review').length,
  latestVersion: pipe(
    feedItems,
    RA.filter((item): item is ArticleVersionFeedItem => item.type === 'article-version'),
    RA.lookup(0),
    O.map((articleVersionFeedItem) => articleVersionFeedItem.occurredAt),
  ),
});
