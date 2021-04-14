import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { FeedItem } from './render-feed';
import { ArticleServer } from '../types/article-server';

type HandleArticleVersionErrors = (
  feedItems: ReadonlyArray<FeedItem>,
  server: ArticleServer,
) => RNEA.ReadonlyNonEmptyArray<FeedItem>;

export const handleArticleVersionErrors: HandleArticleVersionErrors = (items, server) => pipe(
  items,
  E.fromPredicate(
    // TODO RA.some() should be able to confirm it's non-empty
    (feedItems): feedItems is RNEA.ReadonlyNonEmptyArray<FeedItem> => (
      feedItems.some((feedItem) => feedItem.type === 'article-version')
    ),
    (array) => RA.snoc(array, { type: 'article-version-error', server }),
  ),
  E.toUnion,
);
