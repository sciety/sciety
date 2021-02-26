import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { identity, pipe } from 'fp-ts/function';
import { GetFeedItems } from './render-feed';

export const handleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  (doi, server) => pipe(
    getFeedItems(doi, server),
    T.map(
      E.fromPredicate(
        RA.some((feedItem) => feedItem.type === 'article-version'),
        (array) => RA.snoc(array, { type: 'article-version-error', server }),
      ),
    ),
    T.map(E.fold(identity, identity)),
  )
);
