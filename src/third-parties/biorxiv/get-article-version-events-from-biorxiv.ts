import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { isArticleVersionRecordedEvent } from '../../domain-events/article-version-recorded-event';
import { ArticleServer } from '../../types/article-server';
import { Doi, eqDoi } from '../../types/doi';
import { GetAllEvents } from '../../shared-ports';

type Dependencies = {
  getAllEvents: GetAllEvents,
};

type ArticleVersion = {
  source: URL,
  publishedAt: Date,
  version: number,
};

export type GetArticleVersionEventsFromBiorxiv = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<ArticleVersion>>>;
export const getArticleVersionEventsFromBiorxiv = (
  deps: Dependencies,
): GetArticleVersionEventsFromBiorxiv => (doi, server) => pipe(
  deps.getAllEvents,
  T.map(RA.filter(isArticleVersionRecordedEvent)),
  T.map(RA.filter((event) => eqDoi.equals(event.articleId, doi))),
  T.map(RNEA.fromReadonlyArray),
  TO.map(RNEA.map((event) => ({
    // missing in event
    // source: new URL(`https://www.${server}.org/content/${doi.value}v${version}`),
    source: new URL(`https://www.biorxiv.org/content/${doi.value}v${event.version}`),
    publishedAt: event.publishedAt,
    version: event.version,
  }))),
);
