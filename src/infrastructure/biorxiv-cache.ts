import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TO from 'fp-ts/TaskOption';
import { ArticleVersion } from './get-article-version-events-from-biorxiv';
import { Logger } from './logger';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';

type GetArticleVersionEventsFromBiorxiv = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>;

type BiorxivCache = Record<string, ReturnType<ReturnType<GetArticleVersionEventsFromBiorxiv>>>;

export const biorxivCache = (
  getArticleVersionEventsFromBiorxiv: GetArticleVersionEventsFromBiorxiv,
  logger: Logger,
): GetArticleVersionEventsFromBiorxiv => {
  const cache: BiorxivCache = {}; // TODO should not be stateful

  return (doi, server) => async () => {
    const cached = cache[doi.value];
    if (cached !== undefined) {
      logger('debug', 'bioRxiv cache hit', { doi });
      return cached;
    }
    logger('debug', 'bioRxiv cache miss', { doi });
    const promise = getArticleVersionEventsFromBiorxiv(doi, server)();
    void promise.then((result) => {
      if (O.isNone(result)) {
        delete cache[doi.value];
      }
    });
    cache[doi.value] = promise;
    return promise;
  };
};
