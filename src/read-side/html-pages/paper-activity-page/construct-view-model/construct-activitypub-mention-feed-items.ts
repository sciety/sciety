import { URL } from 'url';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ActivityPubMention } from '../../../../types/activitypub-mention';
import { toHtmlFragment } from '../../../../types/html-fragment';
import * as PH from '../../../../types/publishing-history';
import { sanitise } from '../../../../types/sanitised-html-fragment';
import { ActivityPubMentionPublishedFeedItem } from '../view-model';

const toAuthorHandle = (attributedTo: string): string => {
  try {
    const actorUrl = new URL(attributedTo);
    const username = actorUrl.pathname.split('/').filter((segment) => segment !== '').pop();
    return username === undefined ? attributedTo : `${username}@${actorUrl.host}`;
  } catch {
    return attributedTo;
  }
};

const toFeedItem = (note: ActivityPubMention): ActivityPubMentionPublishedFeedItem => ({
  type: 'activitypub-mention-published',
  publishedAt: note.published,
  source: note.source,
  authorHandle: toAuthorHandle(note.attributedTo),
  content: sanitise(toHtmlFragment(note.content)),
  href: note.href,
});

export const constructActivityPubMentionFeedItems = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
): T.Task<ReadonlyArray<ActivityPubMentionPublishedFeedItem>> => pipe(
  dependencies.fetchActivityPubNotes(history),
  TE.map(RA.map(toFeedItem)),
  TE.getOrElseW(() => T.of([])),
);
