import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { identity, pipe } from 'fp-ts/lib/function';
import { GetFeedItems } from './render-feed';

export const createHandleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  (doi, server) => pipe(
    getFeedItems(doi, server),
    T.map(
      E.fromPredicate(
        // TODO: use RA.some
        (array) => array.some((feedItem) => feedItem.type === 'article-version'),
        (array) => RA.snoc(array, { type: 'article-version-error', server }),
      ),
    ),
    T.map(E.fold(identity, identity)),
  )
);
