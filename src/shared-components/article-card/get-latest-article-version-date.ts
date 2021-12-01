import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{ publishedAt: Date }>>;

type GetLatestArticleVersionDate = (
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
) => (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

export const getLatestArticleVersionDate: GetLatestArticleVersionDate = (
  findVersionsForArticleDoi,
) => (
  doi, server,
) => pipe(
  [doi, server],
  tupled(findVersionsForArticleDoi),
  T.map(O.map(flow(
    RNEA.last,
    (version) => version.publishedAt,
  ))),
);
