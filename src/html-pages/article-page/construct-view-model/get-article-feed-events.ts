import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import { getFeedEventsContent, Ports as GetFeedEventsContentPorts } from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { mergeFeeds } from './merge-feeds';
import { ArticleServer } from '../../../types/article-server';
import { Doi } from '../../../types/doi';
import { FeedItem } from '../view-model';
import { FindVersionsForArticleDoi } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Ports = GetFeedEventsContentPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getEvaluationsForDoi: Queries['getEvaluationsForDoi'],
};

type GetArticleFeedEventsByDateDescending = (
  adapters: Ports
) => (
  doi: Doi,
  server: ArticleServer,
) => T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  adapters,
) => (
  doi, server,
) => pipe(
  [
    pipe(
      adapters.getEvaluationsForDoi(doi),
      T.of,
      T.map(RA.map((review) => ({ type: 'review', ...review } as const))),
    ),
    pipe(
      adapters.findVersionsForArticleDoi(doi, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({ type: 'article-version', ...version } as const)),
      ),
    ),
  ] as const,
  mergeFeeds,
  T.chain(getFeedEventsContent(adapters, server)),
  T.map(handleArticleVersionErrors(server)),
);
