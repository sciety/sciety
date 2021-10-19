import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

export type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchArticle: (doi: Doi) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

export const getDateOfMostRecentArticleVersion = (
  ports: Ports, articleId: Doi,
): TE.TaskEither<DE.DataError, O.Option<Date>> => pipe(
  articleId,
  ports.fetchArticle,
  TE.chainW(({ server }) => pipe(
    ports.findVersionsForArticleDoi(articleId, server),
    TO.map(
      (versions) => pipe(
        versions,
        RNEA.last,
        (version) => version.occurredAt,
      ),
    ),
    TE.rightTask,
  )),
);
