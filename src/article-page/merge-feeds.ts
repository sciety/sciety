import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { FeedEvent } from './get-feed-events-content';

type MergeFeeds = (feeds: RNEA.ReadonlyNonEmptyArray<Feed>) => Feed;

type Feed = T.Task<ReadonlyArray<FeedEvent>>;

const byDate: Ord.Ord<FeedEvent> = pipe(
  Ord.ordDate,
  Ord.contramap((event) => event.occurredAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.getDualOrd,
);

export const mergeFeeds: MergeFeeds = flow(
  T.sequenceArray,
  T.map(RA.flatten),
  T.map(RA.sort(byDateDescending)),
);
