import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import { FeedItem } from './render-feed';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

type GetFeedItems = (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => T.Task<ReadonlyArray<FeedItem>>;

type HandleArticleVersionErrors = (
  doi: Doi,
  server: ArticleServer,
  userId: O.Option<UserId>,
) => T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

export const handleArticleVersionErrors = (
  getFeedItems: GetFeedItems,
): HandleArticleVersionErrors => (
  (doi, server, userId) => pipe(
    getFeedItems(doi, server, userId),
    T.map(flow(
      E.fromPredicate(
        // TODO RA.some() should be able to confirm it's non-empty
        (feedItems): feedItems is RNEA.ReadonlyNonEmptyArray<FeedItem> => (
          feedItems.some((feedItem) => feedItem.type === 'article-version')
        ),
        (array) => RA.snoc(array, { type: 'article-version-error', server }),
      ),
      E.fold(identity, identity),
    )),
  )
);
