import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { FeedEvent } from './get-feed-events-content';

type MergeFeeds = (feeds: RNEA.ReadonlyNonEmptyArray<Feed>) => Feed;

type Feed = T.Task<ReadonlyArray<FeedEvent>>;

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.occurredAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

export const mergeFeeds: MergeFeeds = (feeds) => pipe(
  feeds,
  T.sequenceArray,
  T.map(flow(
    RA.flatten,
    RA.sort(byDateDescending),
  )),
);
