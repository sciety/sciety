import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FeedEvent } from './get-feed-events-content';
import * as DE from '../../types/data-error';

type Feed = TE.TaskEither<DE.DataError, ReadonlyArray<FeedEvent>>;

type MergeFeeds = (feeds: RNEA.ReadonlyNonEmptyArray<Feed>) => Feed;

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

export const mergeFeeds: MergeFeeds = (feeds) => pipe(
  feeds,
  TE.sequenceArray,
  TE.map(flow(
    RA.flatten,
    RA.sort(byDateDescending),
  )),
);
