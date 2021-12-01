import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{
  source: URL,
  publishedAt: Date,
  version: number,
}>>;

export type Ports = {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchArticle: (doi: Doi) => TE.TaskEither<DE.DataError, { server: ArticleServer }>,
};

type GetPublishedDateOfMostRecentArticleVersion = (
  ports: Ports,
  articleId: Doi,
) => TE.TaskEither<DE.DataError, O.Option<Date>>;

export const getPublishedDateOfMostRecentArticleVersion: GetPublishedDateOfMostRecentArticleVersion = () => (
  TE.right(O.none)
);
