import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { identity, pipe } from 'fp-ts/function';
import { FeedItem } from './render-feed';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

type GetFeedItems = (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => T.Task<ReadonlyArray<FeedItem>>;

export const handleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): GetFeedItems => (
  (doi, server, userId) => pipe(
    getFeedItems(doi, server, userId),
    T.map(
      E.fromPredicate(
        RA.some((feedItem) => feedItem.type === 'article-version'),
        (array) => RA.snoc(array, { type: 'article-version-error', server }),
      ),
    ),
    T.map(E.fold(identity, identity)),
  )
);
