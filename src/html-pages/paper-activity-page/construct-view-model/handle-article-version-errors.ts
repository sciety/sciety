import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../../types/article-server';
import { FeedItem } from '../view-model';

type HandleArticleVersionErrors = (server: ArticleServer)
=> (feedItems: ReadonlyArray<FeedItem>)
=> RNEA.ReadonlyNonEmptyArray<FeedItem>;

export const handleArticleVersionErrors: HandleArticleVersionErrors = (server) => (items) => pipe(
  items,
  E.fromPredicate(
    RA.some((feedItem) => feedItem.type === 'paper-expression'),
    (array) => RA.snoc(array, { type: 'article-version-error', server }),
  ),
  E.toUnion,
);
