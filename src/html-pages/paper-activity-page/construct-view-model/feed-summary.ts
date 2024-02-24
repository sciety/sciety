import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ExpressionPublishedFeedItem, FeedItem, EvaluationPublishedFeedItem } from '../view-model.js';

type FeedSummary = {
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};

export const feedSummary = (feedItems: ReadonlyArray<FeedItem>): FeedSummary => ({
  evaluationCount: feedItems.filter((item) => item.type === 'evaluation-published').length,
  latestVersion: pipe(
    feedItems,
    RA.filter((item): item is ExpressionPublishedFeedItem => item.type === 'expression-published'),
    RA.lookup(0),
    O.map((paperExpressionFeedItem) => paperExpressionFeedItem.publishedAt),
  ),
  latestActivity: pipe(
    feedItems,
    RA.filter((item): item is EvaluationPublishedFeedItem => item.type === 'evaluation-published'),
    RA.lookup(0),
    O.map((evaluationFeedItem) => evaluationFeedItem.publishedAt),
  ),
});
