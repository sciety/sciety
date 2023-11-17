import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server.js';
import { ArticleId } from '../../types/article-id.js';
import { FindVersionsForArticleDoi } from '../../shared-ports/index.js';

export type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

type GetLatestArticleVersionDate = (
  ports: Ports,
) => (articleDoi: ArticleId, server: ArticleServer) => TO.TaskOption<Date>;

export const getLatestArticleVersionDate: GetLatestArticleVersionDate = (
  ports,
) => (
  doi, server,
) => pipe(
  [doi, server],
  tupled(ports.findVersionsForArticleDoi),
  T.map(O.map(flow(
    RNEA.last,
    (version) => version.publishedAt,
  ))),
);
