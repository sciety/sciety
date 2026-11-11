import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { AtprotoMention } from '../../../../types/atproto-mention';
import * as PH from '../../../../types/publishing-history';
import { AtprotoMentionPublishedFeedItem } from '../view-model';

const sourcesEnabledFor = (
  sembleCardUrls: ReadonlyArray<string>,
): ReadonlyArray<AtprotoMention['source']> => [
  'Bluesky',
  ...(RA.isNonEmpty(sembleCardUrls) ? ['Semble' as const] : []),
];

const toFeedItem = (mention: AtprotoMention): AtprotoMentionPublishedFeedItem => ({
  type: 'atproto-mention-published',
  publishedAt: mention.createdAt,
  source: mention.source,
  authorHandle: mention.authorHandle,
  text: mention.text,
  href: mention.href,
});

export const constructAtprotoMentionFeedItems = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
): T.Task<ReadonlyArray<AtprotoMentionPublishedFeedItem>> => pipe(
  dependencies.fetchSembleCardUrls(history),
  TE.getOrElseW(() => T.of<ReadonlyArray<string>>([])),
  T.chain((sembleCardUrls) => pipe(
    dependencies.fetchAtprotoMentions(history, sourcesEnabledFor(sembleCardUrls), sembleCardUrls),
    TE.map(RA.map(toFeedItem)),
    TE.getOrElseW(() => T.of([])),
  )),
);
