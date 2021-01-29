import { contramap, getDualOrd, ordDate } from 'fp-ts/lib/Ord';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import { FeedEvent, GetFeedEvents } from './get-feed-events-content';

const byDate = contramap<Date, FeedEvent>((event) => event.occurredAt)(ordDate);
const byDateDescending = getDualOrd(byDate)

export const composeFeedEvents = (
  ...composedGetFeedEvents: Array<GetFeedEvents>
): GetFeedEvents => (
  (doi) => pipe(
    composedGetFeedEvents,
    T.traverseArray((getFeedEvents) => getFeedEvents(doi)),
    T.map(RA.flatten),
    T.map(RA.sort(byDateDescending)),
  )
);
