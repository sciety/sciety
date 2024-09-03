import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ArticleServer, articleServers } from '../../../types/article-server';

export const identifyExpressionServer = (url: string): O.Option<ArticleServer> => pipe(
  articleServers,
  R.filter((info) => url.includes(`://${info.domain}`)),
  R.keys,
  A.match(
    () => O.none,
    (keys) => O.some(keys[0] as ArticleServer),
  ),
);
