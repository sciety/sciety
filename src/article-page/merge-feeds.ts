import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { FeedEvent } from './get-feed-events-content';
import { Doi } from '../types/doi';

type Feed = (articleDoi: Doi) => T.Task<ReadonlyArray<FeedEvent>>;

const byDate: Ord.Ord<FeedEvent> = pipe(
  Ord.ordDate,
  Ord.contramap((event) => event.occurredAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.getDualOrd,
);

export const mergeFeeds = (feeds: Array<Feed>): Feed => (doi) => pipe(
  feeds,
  T.traverseArray((feed) => feed(doi)),
  T.map(RA.flatten),
  T.map(RA.sort(byDateDescending)),
);
