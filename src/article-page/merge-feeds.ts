import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Feed, FeedEvent } from './get-feed-events-content';

const byDate = Ord.contramap<Date, FeedEvent>((event) => event.occurredAt)(Ord.ordDate);
const byDateDescending = Ord.getDualOrd(byDate);

export const mergeFeeds = (feeds: Array<Feed>): Feed => (doi) => pipe(
  feeds,
  T.traverseArray((feed) => feed(doi)),
  T.map(RA.flatten),
  T.map(RA.sort(byDateDescending)),
);
