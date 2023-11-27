import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleVersionFeedItem, FeedItem, EvaluationFeedItem } from '../view-model';

type FeedSummary = {
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};

export const feedSummary = (feedItems: ReadonlyArray<FeedItem>): FeedSummary => ({
  evaluationCount: feedItems.filter((item) => item.type === 'evaluation').length,
  latestVersion: pipe(
    feedItems,
    RA.filter((item): item is ArticleVersionFeedItem => item.type === 'article-version'),
    RA.lookup(0),
    O.map((articleVersionFeedItem) => articleVersionFeedItem.publishedAt),
  ),
  latestActivity: pipe(
    feedItems,
    RA.filter((item): item is EvaluationFeedItem => item.type === 'evaluation'),
    RA.lookup(0),
    O.map((evaluationFeedItem) => evaluationFeedItem.publishedAt),
  ),
});
