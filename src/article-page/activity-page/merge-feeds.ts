import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { FeedEvent } from './get-feed-events-content';

type MergeFeeds = <R>(feeds: RNEA.ReadonlyNonEmptyArray<Feed<R>>) => Feed<R>;

type Feed<R> = (r: R) => T.Task<ReadonlyArray<FeedEvent>>;

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.occurredAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

export const mergeFeeds: MergeFeeds = flow(
  RT.sequenceArray,
  RT.map(flow(
    RA.flatten,
    RA.sort(byDateDescending),
  )),
);
